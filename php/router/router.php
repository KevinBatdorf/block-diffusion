<?php
defined('ABSPATH') or die;

if (!class_exists('KBSDRouter')) {
    class KBSDRouter extends \WP_REST_Controller
    {
        protected static $instance = null;
        public function __construct()
        {
            add_filter('rest_request_before_callbacks', function ($response, $handler, $request) {
                if (!strpos($request->get_route(), 'stable-diffusion')) {
                    return $response;
                }
                $request->set_header('authorization', $this->findAuthToken($request));
                return $response;
            }, 10, 3);
        }

        public function getHandler($namespace, $endpoint, $callback)
        {
            register_rest_route(
                $namespace,
                $endpoint,
                [
                    'methods' => 'GET',
                    'callback' => $callback,
                    // handle per route beyond nonce
                    'permission_callback' => function ($request) {
                        return wp_verify_nonce(sanitize_text_field(wp_unslash($request->get_header('x_wp_nonce'))), 'wp_rest');
                    }
                ]
            );
        }
        public function postHandler($namespace, $endpoint, $callback)
        {
            register_rest_route(
                $namespace,
                $endpoint,
                [
                    'methods' => 'POST',
                    'callback' => $callback,
                    // handle per route beyond nonce
                    'permission_callback' => function ($request) {
                        return wp_verify_nonce(sanitize_text_field(wp_unslash($request->get_header('x_wp_nonce'))), 'wp_rest');
                    }
                ]
            );
        }

        public static function noPermission()
        {
            $message = __('You do not have permission', 'stable-diffusion');
            return new WP_Error('rest_forbidden', $message, ['status' => 403]);
        }

        public static function missingParameters($inputs)
        {
            $message = __('Missing inputs', 'stable-diffusion');
            return new WP_Error('rest_missing_inputs', $message, ['status' => 400, 'inputs' => $inputs]);
        }

        public static function __callStatic($name, array $arguments)
        {
            $name = "{$name}Handler";
            if (is_null(self::$instance)) {
                self::$instance = new static();
            }
            $r = self::$instance;
            return $r->$name('kevinbatdorf/stable-diffusion', ...$arguments);
        }

        private function findAuthToken($request)
        {
            $options = get_option('stable_diffusion_settings', ['apiToken' => '']);
            $hasToken = isset($options['apiToken']) && $options['apiToken'];
            $token = $hasToken ? "Token {$options['apiToken']}" : '';
            return $token;
        }
    }
}
