<?php

defined('ABSPATH') or die;

add_action('plugins_loaded', function() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'block_diffusion_api';
    $table_schema = "CREATE TABLE $table_name (
        id VARCHAR(255) NOT NULL,
        model_input TEXT,
        model_output TEXT,
        predict_time TEXT,
        user_id INT(11),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY user_id (user_id)
    ) COLLATE {$wpdb->collate}";

    // Create the table if it doesn't exist
    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($table_schema);
    }
});
