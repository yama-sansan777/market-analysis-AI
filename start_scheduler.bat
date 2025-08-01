@echo off
echo Starting Market Analysis Scheduler with PM2...
cd /d "C:\Users\TS2\Desktop\market-analysis-AI"
pm2 resurrect
if %errorlevel% neq 0 (
    echo PM2 resurrect failed, starting fresh...
    pm2 start scheduler.js --name "market-analysis-scheduler"
)
echo Scheduler started successfully!
pm2 status
pause