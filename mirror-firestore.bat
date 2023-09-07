@echo off

@RD /S /Q "%CD%\firestore-import"
cmd /C gcloud "config" "set" "project" "ourpraise-fb"
cmd /C gsutil "-m" "rm" "-r" "gs://ourpraise-fb.appspot.com/firestore-import"
cmd /C gcloud "firestore" "export" "gs://ourpraise-fb.appspot.com/firestore-import"
cmd /C gsutil "-m" "cp" "-r" "gs://ourpraise-fb.appspot.com/firestore-import" "."

EXIT /B %ERRORLEVEL%
