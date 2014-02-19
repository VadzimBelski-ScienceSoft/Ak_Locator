# Magento Store Locator
A store locator extension for Magento.

[![Scrutinizer Quality Score](https://scrutinizer-ci.com/g/andrewkett/Ak_Locator/badges/quality-score.png?s=ed69380af3f8cae9103d253d27e7c193fbe02914)](https://scrutinizer-ci.com/g/andrewkett/Ak_Locator/) [![SensioLabsInsight](https://insight.sensiolabs.com/projects/657284eb-b4cc-4d69-b110-2eed060b653d/mini.png)](https://insight.sensiolabs.com/projects/657284eb-b4cc-4d69-b110-2eed060b653d)  [![Dependency Status](https://www.versioneye.com/user/projects/52b0f598ec1375b8dc000037/badge.png)](https://www.versioneye.com/user/projects/52b0f598ec1375b8dc000037) 

## Installation. 
This extension can be installed a few different ways:

### Using modman
        
    modman clone git://github.com/andrewkett/Ak_Locator.git

### Using composer 
    
add a composer.json file to your root directory

    {
        "minimum-stability":"dev",
        "repositories": [
            {
              "type":"composer",
              "url":"http://packages.firegento.com"
            }
        ],
        "require": {
            "andrewkett/locator" : "dev-master"
        },
        "extra":{
            "magento-root-dir":"./",
            "magento-force":"true"
        }
    }

then 

    composer.phar install

If you are using composer and your dependencies are not being installed to the lib directory, copy the [geoPHP](https://github.com/phayes/geoPHP) directory into your lib directory

### Download and install manually.

[https://github.com/andrewkett/Ak_Locator/archive/master.zip](https://github.com/andrewkett/Ak_Locator/archive/master.zip)

You will also need to add the [geoPHP](https://github.com/phayes/geoPHP) library to the lib directory

## Configuration

After the extension is installed you will need to add a [google maps API key](https://developers.google.com/maps/documentation/javascript/tutorial#api_key) in the Locator Settings configuration tab.


## Licence
[OSL - Open Software Licence 3.0](http://opensource.org/licenses/osl-3.0.php)

## Copyright
(c) 2013 Andrew Kett

Disclaimer: This extension under active development and is not yet at a stable release. It is provided "as is", it may be buggy or completely break your website. 
