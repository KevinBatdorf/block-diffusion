<?php

defined('ABSPATH') or die;

include_once(__DIR__ . '/router.php');

add_action('rest_api_init', function() {
    $prefix = '/image-filter';

    KBSDRouter::post($prefix . '/login', function($payload) {
        if (!current_user_can('upload_files')) {
            return new WP_REST_Response(
                ['message' => 'You do not have permission'],
                403
            );
        }
        $stableDiffusionHeaders = ['Authorization' => $payload->get_header('authorization')];
        $stableDiffusionResponse = wp_remote_get(
            "https://api.replicate.com/v1/predictions",
            ['headers' => $stableDiffusionHeaders],
        );
        return new WP_REST_Response(
            json_decode(wp_remote_retrieve_body($stableDiffusionResponse), true),
            wp_remote_retrieve_response_code($stableDiffusionResponse)
        );
    });

    KBSDRouter::get($prefix . '/get-model', function($payload) {
        if (!current_user_can('upload_files')) {
            return new WP_REST_Response(
                ['message' => 'You do not have permission'],
                403
            );
        }
        $stableDiffusionSettings = $payload->get_param('model');
        $stableDiffusionResponse = wp_remote_get(
            "https://api.replicate.com/v1/models/{$stableDiffusionSettings}",
            [ 'headers' => ['Authorization' => $payload->get_header('authorization')]],
        );
        return new WP_REST_Response(
            json_decode(wp_remote_retrieve_body($stableDiffusionResponse), true),
            wp_remote_retrieve_response_code($stableDiffusionResponse)
        );
    });

    KBSDRouter::post($prefix . '/generate', function($payload) {
        if (!current_user_can('upload_files')) {
            return new WP_REST_Response(
                ['message' => 'You do not have permission'],
                403
            );
        }
        $stableDiffusionResponse = wp_remote_post(
            'https://api.replicate.com/v1/predictions',
            [
                'headers' => [
                    'Authorization' => $payload->get_header('authorization'),
                    'Content-Type' => 'application/json',
                ],
                'body' => json_encode($payload->get_params()),
            ],

        );
        return new WP_REST_Response(
            json_decode(wp_remote_retrieve_body($stableDiffusionResponse), true),
            wp_remote_retrieve_response_code($stableDiffusionResponse)
        );
    });

    KBSDRouter::get($prefix . '/get-prediction', function($payload) {
        if (!current_user_can('upload_files')) {
            return new WP_REST_Response(
                ['message' => 'You do not have permission'],
                403
            );
        }
        $stableDiffusionSettings = $payload->get_param('id');
        $stableDiffusionResponse = wp_remote_get(
            "https://api.replicate.com/v1/predictions/{$stableDiffusionSettings}",
            [ 'headers' => ['Authorization' => $payload->get_header('authorization')]],
        );
        return new WP_REST_Response(
            json_decode(wp_remote_retrieve_body($stableDiffusionResponse), true),
            wp_remote_retrieve_response_code($stableDiffusionResponse)
        );
    });

    KBSDRouter::post($prefix . '/cancel', function($payload) {
        if (!current_user_can('upload_files')) {
            return new WP_REST_Response(
                ['message' => 'You do not have permission'],
                403
            );
        }
        $stableDiffusionSettings = $payload->get_param('id');
        $stableDiffusionResponse = wp_remote_post(
            "https://api.replicate.com/v1/predictions/{$stableDiffusionSettings}/cancel",
            ['headers' => ['Authorization' => $payload->get_header('authorization')]],
        );
        return new WP_REST_Response(
            json_decode(wp_remote_retrieve_body($stableDiffusionResponse), true),
            wp_remote_retrieve_response_code($stableDiffusionResponse)
        );
    });

    KBSDRouter::get($prefix . '/prompt-suggestion', function($payload) {
        if (!current_user_can('upload_files')) {
            return new WP_REST_Response(
                ['message' => 'You do not have permission'],
                403
            );
        }
        $stableDiffusionResponse = wp_remote_get("https://www.block-diffusion.com/api/v1/prompt");
        return new WP_REST_Response(
            json_decode(wp_remote_retrieve_body($stableDiffusionResponse), true),
            wp_remote_retrieve_response_code($stableDiffusionResponse)
        );
    });

    KBSDRouter::post($prefix . '/options', function($payload) {
        if (!current_user_can('upload_files')) {
            return new WP_REST_Response(
                ['message' => 'You do not have permission'],
                403
            );
        }
        if (isset($payload['stable_diffusion_options'])) {
            update_option('stable_diffusion_options', $payload['stable_diffusion_options']);
        }
        return new WP_REST_Response(
            ['stable_diffusion_options' => get_option('stable_diffusion_options')],
            200
        );
    });
    KBSDRouter::get($prefix . '/options', function($payload) {
        if (!current_user_can('upload_files')) {
            return new WP_REST_Response(
                ['message' => 'You do not have permission'],
                403
            );
        }
        return new WP_REST_Response(
            ['stable_diffusion_options' => get_option('stable_diffusion_options')],
            200
        );
    });
});
