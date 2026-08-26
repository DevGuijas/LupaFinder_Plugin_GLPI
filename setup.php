<?php

use Glpi\Plugin\Hooks;

define('PLUGIN_LUPAFINDER_VERSION', '1.0.1');

function plugin_init_lupafinder(): void
{
    global $PLUGIN_HOOKS;

    $PLUGIN_HOOKS[Hooks::CSRF_COMPLIANT]['lupafinder'] = true;
    $PLUGIN_HOOKS[Hooks::ADD_CSS]['lupafinder'] = 'css/lupa-finder.css';
    $PLUGIN_HOOKS[Hooks::ADD_JAVASCRIPT]['lupafinder'] = 'js/lupa-finder.js';
}

function plugin_version_lupafinder(): array
{
    return [
        'name'         => 'Lupa_Finder',
        'version'      => PLUGIN_LUPAFINDER_VERSION,
        'author'       => '@DevGuijas - GitHub',
        'license'      => 'GPL-3.0-or-later',
        'requirements' => ['glpi' => ['min' => '11.0.1', 'max' => '11.0.99']],
    ];
}

function plugin_lupafinder_check_prerequisites(): bool
{
    return version_compare(GLPI_VERSION, '11.0.1', '>=')
        && version_compare(GLPI_VERSION, '11.1.0', '<');
}

function plugin_lupafinder_check_config($verbose = false): bool
{
    return true;
}
