<?php

defined('ABSPATH') or die;

include_once(__DIR__ . '/router.php');


add_action('rest_api_init', function() {
    $prefix = '/global';

    KBSDRouter::post($prefix . '/save-token', function($payload) {
        if (!current_user_can('manage_options')) {
            return new WP_REST_Response(
                ['message' => 'You do not have permission'],
                403
            );
        }
        update_option('stable_diffusion_settings', [
            'apiToken' => (string) $payload->get_param('token')
        ]);
        return new WP_REST_Response(['success' => true], 200);
    });

});
