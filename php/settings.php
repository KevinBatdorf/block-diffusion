<?php

defined( 'ABSPATH' ) or die;

add_action('admin_init', 'stable_diffusion_register_settings');
add_action('rest_api_init', 'stable_diffusion_register_settings');
if (!function_exists('stable_diffusion_register_settings')) {
    function stable_diffusion_register_settings() {
        // This should have been named auth probably this is fine to leave as is.
        register_setting('stable_diffusion_settings', 'stable_diffusion_settings', [
            'type' => 'object',
            'show_in_rest' => [
                'schema' => [
                    'type' => 'object',
                    'properties' => [
                        "version" => [ 'type' => ['string', 'number'], 'default' => 0 ],
                        'apiToken' => [ 'type' => ['string', 'null'], 'default' => '' ],
                    ],
                ],
            ],
        ]);
        register_setting('stable_diffusion_options', 'stable_diffusion_options', [
            'type' => 'object',
            'show_in_rest' => [
                'schema' => [
                    'type' => 'object',
                    'properties' => [
                        "version" => [ 'type' => ['string', 'number'], 'default' => 0 ],
                        'optIns' => [ 'type' => ['array', 'null'], 'default' => [] ],
                        'seenNotices' => [ 'type' => ['array', 'null'], 'default' => [] ],
                    ],
                ],
            ],
        ]);
    }
}
