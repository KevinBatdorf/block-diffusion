<?php

defined( 'ABSPATH' ) or die;

add_action('rest_api_init', function() {
    KBSDRouter::post('/login', function($payload) {
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

    KBSDRouter::get('/get-model', function($payload) {
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

    KBSDRouter::post('/generate', function($payload) {
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

    KBSDRouter::get('/get-prediction', function($payload) {
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

    KBSDRouter::post('/cancel', function($payload) {
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

    KBSDRouter::get('/prompt-suggestion', function($payload) {
        $stableDiffusionResponse = wp_remote_get("https://www.block-diffusion.com/api/v1/prompt");
        return new WP_REST_Response(
            json_decode(wp_remote_retrieve_body($stableDiffusionResponse), true),
            wp_remote_retrieve_response_code($stableDiffusionResponse)
        );
    });
});
