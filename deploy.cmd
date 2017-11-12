echo Handling node.js deployment.

call :SelectNodeVersion

IF EXIST "%DEPLOYMENT_SOURCE%\package.json" (
  call :ExecuteCmd !NPM_CMD! install -s yarn
  IF !ERRORLEVEL! NEQ 0 goto error
  call .\node_modules\.bin\yarn install
)

IF EXIST "%DEPLOYMENT_SOURCE%\gulpfile.js" (
  call .\node_modules\.bin\gulp build
  IF !ERRORLEVEL! NEQ 0 goto error
)

IF /I "%IN_PLACE_DEPLOYMENT%" NEQ "1" (
  call :ExecuteCmd "%KUDU_SYNC_CMD%" -v 50 -f "%DEPLOYMENT_SOURCE%\dist" -t "%DEPLOYMENT_TARGET%" -n "%NEXT_MANIFEST_PATH%" -p "%PREVIOUS_MANIFEST_PATH%" -i ".git;.hg;.deployment;deploy.cmd"
  IF !ERRORLEVEL! NEQ 0 goto error
)