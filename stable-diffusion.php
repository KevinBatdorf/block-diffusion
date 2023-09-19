<?php
/**
 * Plugin Name:       Block Diffusion
 * Description:       Generate unique images from text prompts using machine learning, all in the cloud.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.7.1
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

    wp_add_inline_script('kevinbatdorf-stable-diffusion-view-script', 'window.blockDiffusion = ' . wp_json_encode([
        'nonce' => wp_create_nonce('wp_rest'),
        'restUrl' => esc_url_raw(rest_url('kevinbatdorf/stable-diffusion/block')),
    ]) . ';', 'before');
});

include_once(__DIR__ . '/php/global-scripts.php');
include_once(__DIR__ . '/php/router/image-filter.php');
include_once(__DIR__ . '/php/router/global.php');
include_once(__DIR__ . '/php/router/block.php');
include_once(__DIR__ . '/php/db.php');
