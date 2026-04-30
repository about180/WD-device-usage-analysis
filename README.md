<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# WD Device Usage Analysis

## 最新功能：全局時間過濾器 (Global Date & Time Filter)
近期加入了全域的「日期與時間」過濾功能：
- **資料庫更新 (Data Schema Update)**：為 `ReceiverLog` 型別新增 `recordTime` 屬性，CSV 解析器現在支援讀取 "Date & Time" 與 "RecordTime" 欄位。
- **全域過濾器 (Global Filter Bar)**：在頂部導覽列（Sticky Header）新增「時間區間」下拉選單，與設備過濾器並列，預設為「All Time」。
- **支援多種區間 (Range Support)**：提供 Past 1 Hour, Past 24 Hours, Past 7 Days, Past 30 Days, Past Quarter, Past Half Year, Past Year 快速過濾。
- **即時同步 (Real-time Sync)**：狀態統一在 `Dashboard.tsx` 頂層管理，切換時間區間時，所有頁籤 (User Query, Firmware, Receiver Analysis, Usage Share, Receiver Reboot) 都能即時同步更新結果。

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
