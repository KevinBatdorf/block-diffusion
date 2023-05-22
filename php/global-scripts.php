<?php

defined('ABSPATH') or die;

add_action('init', function () {
    if (!current_user_can('manage_options')) return;

    $deps = plugin_dir_path(__DIR__) . 'build/global.asset.php';
    $scriptAsset = file_exists($deps) ?
        require $deps :
        ['dependencies' => [], 'version' => uniqid()];

    foreach ($scriptAsset['dependencies'] as $style) {
        wp_enqueue_style($style);
    }
    wp_enqueue_script(
        'stable-diffusion-global',
        plugin_dir_url(__DIR__) . 'build/global.js',
        $scriptAsset['dependencies'],
        $scriptAsset['version'],
        true
    );
    wp_enqueue_style(
        'stable-diffusion-global',
        plugin_dir_url(__DIR__) . 'build/global.css',
        [],
        filemtime(plugin_dir_path(__DIR__) . 'build/global.css')
    );
});
