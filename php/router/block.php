<?php

defined('ABSPATH') or die;

include_once(__DIR__ . '/router.php');


add_action('rest_api_init', function () {
    $prefix = '/block';

    KBSDRouter::get($prefix . '/get-capabilities', function ($payload) {
        if (!current_user_can('manage_options')) {
            return KBSDRouter::noPermission();
        }

        // get a list of every registered capability for every role
        $capabilities = [];
        foreach (wp_roles()->roles as $role) {
            foreach ($role['capabilities'] as $capability => $value) {
                if (!isset($capabilities[$capability])) {
                    $capabilities[$capability] = [];
                }
                if ($value) {
                    $capabilities[$capability][] = $role['name'];
                }
            }
        }

        return new WP_REST_Response($capabilities, 200);
    });

    KBSDRouter::post($prefix . '/access-list', function ($payload) {
        if (!current_user_can('manage_options')) {
            return KBSDRouter::noPermission();
        }

        $params = $payload->get_params();
        if (!$params['id'] || !isset($params['data'])) {
            return new WP_REST_Response(
                ['message' => 'Missing required parameters'],
                400
            );
        }

        $accessList = get_option('stable_diffusion_access_list', []);
        $accessList[$params['id']] = $params['data'];
        update_option('stable_diffusion_access_list', $accessList);

        ray($accessList);
        return new WP_REST_Response('OK', 200);
    });

    KBSDRouter::get($prefix . '/access-list', function ($payload) {
        if (!current_user_can('manage_options')) {
            return KBSDRouter::noPermission();
        }

        return new WP_REST_Response(
            get_option('stable_diffusion_access_list', []),
            200
        );
    });

    KBSDRouter::post($prefix . '/predict', function ($payload) {
        if (!current_user_can('manage_options')) {
            return KBSDRouter::noPermission();
        }

        $expected = ['id', 'model', 'prompt'];
        $input = $payload->get_params();
        if (!empty($missing = array_diff($expected, array_keys($input)))) {
            return KBSDRouter::missingParameters(array_values($missing));
        }

        return new WP_REST_Response(
            'PONG',
            200
        );
    });

});
