<?php
defined( 'ABSPATH' ) or die;

if (!class_exists('KBSDRouter')) {
    class KBSDRouter extends \WP_REST_Controller
    {
        protected static $instance = null;
        public function getHandler($namespace, $endpoint, $callback) {
            \register_rest_route(
                $namespace,
                $endpoint,
                [
                    'methods' => 'GET',
                    'callback' => $callback,
                    'permission_callback' => function() {
                        return \current_user_can('upload_files');
                    },
                ]
            );
        }
        public function postHandler($namespace, $endpoint, $callback) {
            \register_rest_route(
                $namespace,
                $endpoint,
                [
                    'methods' => 'POST',
                    'callback' => $callback,
                    'permission_callback' => function() {
                        return \current_user_can('upload_files');
                    },
                ]
            );
        }

        public static function __callStatic($name, array $arguments) {
            $name = "{$name}Handler";
            if (is_null(self::$instance)) {
                self::$instance = new static();
            }
            $r = self::$instance;
            return $r->$name('kevinbatdorf/stable-diffusion', ...$arguments);
        }
    }
}
