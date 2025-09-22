#!/bin/bash
set -e

echo "Initializing database.."
echo "This may take a couple of minutes"
echo -ne "                          (0%)\r"
pnpm db:create:prod --silent 1> /dev/null
echo -ne "#######################   (100%)\r"
echo -ne "\n\n"


echo "
 _____            _     _ _ _ 
|  __ \          | |   (_) | |
| |__) |_ _ _   _| |__  _| | |
|  ___/ _  | | | |  _ \| | | |
| |  | (_| | |_| | |_) | | | |
|_|   \____|\___ |____/|_|_|_|
             __/ |            
            |___/       

Open Source Apps To Grow Your Business.!
GitHub: https://github.com/paybilldev/paybill
"

pnpm start:prod --silent