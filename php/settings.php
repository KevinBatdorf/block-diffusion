<?php

defined( 'ABSPATH' ) or die;

add_action('admin_init', 'stable_diffusion_register_settings');
add_action('rest_api_init', 'stable_diffusion_register_settings');
if (!function_exists('stable_diffusion_register_settings')) {
    function stable_diffusion_register_settings() {
        register_setting('stable_diffusion_settings', 'stable_diffusion_settings', [
            'type' => 'object',
            'show_in_rest' => [
                'schema' => [
                    'type' => 'object',
                    'properties' => [
                        "version" => [ 'type' => ['string', 'number'] ],
                        'prompts' => [ 'type' => ['array', 'null'] ],
                        'apiKey' => [ 'type' => ['string', 'null'] ],
                    ],
                ],
            ],
        ]);
    }
}
