<?php
declare(strict_types=1);

define('TL_CMS_SITE_NAME', 'Timberlane Blog CMS');
define('TL_CMS_DATA_FILE', dirname(__DIR__) . '/data/blog-posts.json');
define('TL_CMS_BLOG_DIR', dirname(__DIR__) . '/blog');
define('TL_CMS_UPLOAD_DIR', dirname(__DIR__) . '/assets/blog');
define('TL_CMS_UPLOAD_WEB_PATH', '../assets/blog/');
define('TL_CMS_DEFAULT_IMAGE', '../assets/livingroom-1.png');

/*
 * Set TIMBERLANE_CMS_PASSWORD_HASH on the server to a sha256 hash of the real
 * password. Fallback login while setting up: Timberlane@2026
 */
define('TL_CMS_PASSWORD_HASH', getenv('TIMBERLANE_CMS_PASSWORD_HASH') ?: 'd6f45417e37b50fc1f399e311788dff78dadd9bba37f606a1289d175f6d86f2e');

session_name('timberlane_cms');
session_start();
