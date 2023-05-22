<?php
defined('ABSPATH') or die;

if (!class_exists('KBSDRouter')) {
    class KBSDRouter extends \WP_REST_Controller
    {
        protected static $instance = null;
        public function __construct() {
            \add_filter('rest_request_before_callbacks', function ($response, $handler, $request) {
                if (!strpos($request->get_route(), 'stable-diffusion')) {
                    return $response;
                }
                $request->set_header('authorization', $this->findAuthToken($request));
                return $response;
            }, 10, 3);
        }

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

        private function findAuthToken($request) {
            $options = \get_option('stable_diffusion_settings', ['apiToken' => '']);
            $hasToken = isset($options['apiToken']) && $options['apiToken'];
            $token = $hasToken ? "Token {$options['apiToken']}" : '';
            return $token;
        }
    }
}
