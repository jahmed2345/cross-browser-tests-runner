cbtr-testem-saucelabs-init
==========================

This executable helps you generate ``testem.json`` - Testem's settings - from cross-browser-tests-runner :doc:`settings` that includes SauceLabs browsers.  

**NOTE**: Please note that browsers from other platforms would not work even if they are included in the settings file.

Usage
-----

.. code-block:: sh

    $ ./node_modules/.bin/cbtr-testem-saucelabs-init [--help|-h] [--input|-i <cbtr-settings-file>] [--output|-o <testem-settings-file>]

    Defaults:
     input             cbtr.json in project root
     output            testem.json in project root

    Options:
     help              print this help
     input             cross-browser-tests-runner settings file
     output            testem settings file

Questions asked
---------------

On running, the executable would ask you the following questions:

**NOTE**: You need to enter a value, and there are no defaults

-  ``Are you using multiple tunnels with different identifiers? (y/n) [If unsure, choose "n"]``

   -  SauceLabs supports multiple tunnels with different identifiers as well as a single tunnel without any id. If your tests need multiple tunnels, choose 'y', or else 'n'. The tool would generate one tunnel ID per browser in case you chose 'y'.

-  ``Do you need to take screenshots of your tests once completed? (y/n)``
-  ``Do you need to take video of your test? (y/n)``
-  ``Please provide a timeout value [60]``
