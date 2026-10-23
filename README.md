# nuxt cms template

- 使用 nuxt ui 製作 cms 模板
- 參考 https://ui.nuxt.com/theme?view=dashboard
- 不需要接資料只要切板
- 盡量使用nuxt ui 元件

## 製作目標

- 乾淨的layout的頁面
  - / : 登入頁 (UAuthForm)

- 有左邊目錄的layout的頁面
  - /posts : 表格頁 (UTable,UPagination)
    - 可以按欄位標題排序
    - 刪除鍵
  - /posts/create : 新增資料的表單頁 (UForm,UFormField,UBreadcrumb)
    - nuxt ui 表單可以使用的元件
  - /posts/1/edit : 編輯資料的表單頁,使用假資料 (UForm,UFormField,UBreadcrumb)
    - nuxt ui 表單可以使用的元件
  - /profile : 用戶的資料修改表單 (UAvatar,UForm,UFormField)
  - /settings : (UColorModeSelect)

- error.vue : 錯誤頁 (UError)
- [...slug].vue ： 404頁 (UError)

- 左邊目錄
  - 二層,使用假資料

- /dashboard : 儀錶板
  - 按照nuxt ui 範例 放上 6 個不同的 chart (UChart)
  - XL寬度最多放4個
