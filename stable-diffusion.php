<?php
/**
 * Plugin Name:       Block Diffusion
 * Description:       Generate unique images from text prompts using machine learning, all in the cloud.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.3
 * Author:            Kevin Batdorf
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       stable-diffusion
 *
 * @package           kevinbatdorf
 */

add_action('init', function () {
    register_block_type(__DIR__ . '/build');
    wp_set_script_translations('kevinbatdorf/stable-diffusion', 'stable-diffusion');
});

add_action('admin_enqueue_scripts', function () {
    wp_add_inline_script(
        'kevinbatdorf-stable-diffusion-editor-script',
        'window.stableDiffusionConfig = ' . wp_json_encode([
            // Convert to mb
            'maxUploadSize' => number_format(wp_max_upload_size() / 1048576),
        ]),
        'before'
    );
});

include_once(__DIR__ . '/php/settings.php');
include_once(__DIR__ . '/php/router.php');
include_once(__DIR__ . '/php/routes.php');
