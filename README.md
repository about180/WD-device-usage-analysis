
# WD Device Usage Analysis
## Key feature:
ScreenBeam Receiver Log Analysis Tool - User Guide
This application is designed specifically for analyzing device connection logs (Receiver Logs) to help users quickly identify connection performance, stability issues, and reasons for device restarts.

1. **Data Preparation and Upload**

File Requirements
Format: Must be a .csv file.
File Name Restriction: The file name must begin with Receiver_Log (e.g., Receiver_Log.csv).

Key Fields: The CSV file must contain the following fields (corresponding names may vary slightly):

Receiver MAC / ReceiverId
Receiver Name
Source Name / Source User
Event Description
Duration
Date & Time / RecordTime

- Upload Steps

Open the application's homepage.
Drag and drop the CSV file that meets the requirements into the upload area, or click on the area to select the file.
The system will automatically parse the data and display it in the dashboard.

2. **Global Filters**
Above all analytics tabs are two persistent filtering tools:

- Date & Time:
Selectable: All Time, Last 1 Hour, Last 24 Hours, Last 7 Days, Last 30 Days, Last Quarter, Half a Year, One Year.
Update this option immediately filters data across all pages.

- Global Device:
Filter by specific Receiver MAC address, or view "All" for overall statistics.

3. **Function Tab Details**

- Tab 1: User Query
This tab provides a detailed connection list, grouped by "Source User" and "Receiver".
Receiver MAC: Displays the receiver's hardware address.

-- Success / Disc / Abn:

Success: Includes normal connection success, AirPlay, Chromecast, Infracast, and HDMI connections.
Normal Disconnect: Normal connection interruption (e.g., RTSP tear-down, HDMI interruption).
Abnormal Disconnect: Abnormal interruption (e.g., P2P failure, RTSP failure, media path recovery error).
Alert: If multiple different channels or firmware versions are present, a warning icon will be displayed. Click to view detailed information.

- Tab 2: Firmware Version
Analyzes the impact of different firmware versions on connection success rate.
Visual Chart: Displays a comparison of the number of successful connections between different versions.

- Tab 3: Receiver Analysis
In-depth analysis of individual receivers, calculating average connection duration and connection distribution.

- Tab 4: Usage Duration Share
Displays the percentage of total usage time for each source or receiver using pie charts or bar charts.

- Tab 5: Receiver Reboot Analysis

This is a tool specifically designed to diagnose ScreenBeam device stability, categorizing reboot events into two types:
* Normal Reboot: Includes reboots triggered by management interface (MGT/CMS), USB setting updates, idle timeouts, or web setting changes.

* Abnormal Reboot: Includes exception errors (Fault), memory full, hardware watchdog, system initialization failure, player unresponsiveness, and network connection (Netd) interruptions.

Visual Statistics: Provides a comparative bar chart of "Reboot vs. Abnormal Reboot" to help identify devices with higher failure rates.

4. **Frequently Asked Questions (FAQ)**

Why does my uploaded file show an error?
- Please check if the filename conforms to the Receiver_Log*.csv format and confirm that the CSV field names are correct.

The time filter is not working?
- Please confirm that the Date & Time fields in the CSV are in a standard time format.

How do I reset the data? 
- Click "Reset" next to the file name at the top of the page or return to the homepage icon to clear the current data and upload a new file.

## 最新功能更新

- **全域日期與時間過濾器 (Global Date & Time Filter):** 
  - 新增 `RecordTime` 資料解析支援。
  - 在頁首新增時間過濾下拉選單 (支援「過去 1 小時」到「過去 1 年」等多種區間)。
  - 過濾狀態即時連動至所有分析分頁 (包含 User Query, Firmware, Receiver Analysis, Usage Share, Receiver Reboot)。

## 專案設定與執行

**環境需求:** Node.js (建議 v18 以上)

1. **安裝依賴套件:**
   打開終端機 (Terminal) 並輸入：
   ```bash
   npm install
   ```

2. **設定環境變數:**
   將專案內的 `.env.example` 複製為 `.env.local`，並填寫你的 `GEMINI_API_KEY`:
   ```bash
   cp .env.example .env.local
   ```

3. **啟動本地開發伺服器:**
   ```bash
   npm run dev
   ```
   啟動後，開啟瀏覽器造訪 [http://localhost:3000](http://localhost:3000) 即可確認是否正常運行。

## 部署至 GitHub Pages

專案已經設定了 GitHub Actions Workflow (`.github/workflows/deploy.yml`)。

只要將專案推送 (Push) 到 GitHub 的 `main` 或 `master` 分支，GitHub Actions 就會自動觸發打包並部署至 GitHub Pages。

**部署步驟：**
1. 將專案推送到 GitHub Repository。
2. 到 Repository 的 **Settings** -> **Pages**。
3. 在 **Build and deployment** 的 Source 選擇 **GitHub Actions**。
4. 回到 **Actions** 頁籤，確認 `Deploy React App to GitHub Pages` 順利完成。
5. 完成後即可在 GitHub 提供的網址查看你的專案。

## 其他開發指令

- `npm run build`: 打包編譯上線用的靜態檔案 (產出於 `/dist` 目錄)。
- `npm run preview`: 在本地端預覽打包後的檔案。
- `npm run lint`: 執行 TypeScript 語法檢查。
