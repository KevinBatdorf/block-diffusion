<?php
/**
 * Plugin Name:       Block Diffusion
 * Description:       Generate unique images from text prompts using machine learning, all in the cloud.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.8
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
            'devMode' => is_readable(__DIR__ . '/node_modules'),
        ]),
        'before'
    );
});

add_filter('plugin_action_links_' . plugin_basename(__FILE__), function ($links) {
    $links[] = sprintf('<a href="%s" title="%s">%s</a>',
    esc_url(admin_url('post-new.php?post_type=page&block-diffusion-open')),
    __('Loads a new page and opens the application', 'stable-diffusion'),
    __('Enter API Token', 'stable-diffusion'));
    return $links;
});

include_once(__DIR__ . '/php/settings.php');
include_once(__DIR__ . '/php/router.php');
include_once(__DIR__ . '/php/routes.php');
