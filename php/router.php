<?php
defined( 'ABSPATH' ) or die;

if (!class_exists('KBSDRouter')) {
    class KBSDRouter extends \WP_REST_Controller
    {
        protected static $instance = null;
        public function __construct() {
            \add_filter('rest_request_before_callbacks', function ($response, $handler, $request) {
                if (!strpos($request->get_route(), 'stable-diffusion')) {
                    return $response;
                }
                if (!$request->get_header('authorization')) {
                    // Users have reported the headers being stripped out of the request
                    $request->set_header('authorization', $this->findAuthToken($request));
                }
                // If the api token is in the body, remove it
                $body = json_decode($request->get_body(), true);
                if (isset($body['apiToken'])) {
                    unset($body['apiToken']);
                    $request->set_body(json_encode($body));
                }
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
            // If not in options, check for token in request body
            if (!$hasToken) {
                $params = $request->get_params();
                $hasToken = isset($params['apiToken']) && $params['apiToken'];
                $token = $hasToken ? "Token {$params['apiToken']}" : '';
            }
            return $token;
        }
    }
}
