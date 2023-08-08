(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.cartParamsMixin = factory());
}(this, (function () {
  return {
    data() {
      return {
        invoiceList: [
          {
            id: '3',
            title: '電子發票',
            placeholder: '請填寫email',
            apiName: 'invoice_email',
            display: true
          },
          {
            id: '1',
            title: '手機載具',
            placeholder: '請填寫手機載具',
            apiName: 'invoice_phone_id',
            display: true
          },
          {
            id: '2',
            title: '自然人憑證',
            placeholder: '請填寫自然人憑證',
            apiName: 'invoice_user_id',
            display: true,
          },
          {
            id: '4',
            title: '捐贈碼',
            placeholder: '',
            apiName: 'invoice_love_id',
            display: true
          },
          {
            id: '5',
            title: '公司行號',
            placeholder: '請輸入統一編號',
            apiName: 'invoice_num',
            display: true
          },
        ],
        loveInstitution: [
          {
            id: '8957282',
            title: '財團法人流浪動物之家基金會'
          },
          {
            id: '885521',
            title: '財團法人中華民國兒童福利聯盟文教基金會'
          },
          {
            id: '17930',
            title: '社團法人台灣環境資訊協會'
          },
        ],
        mappingActivityCode: {
          normal: '一般商品',
          full_amount_price: '滿額活動',
          full_amount_count: '滿件活動',
          red_with_green: '紅配綠',
          limit_time: '限時限量活動',
          preorder: '預購活動',
          groupbuy: '急殺活動',
          purchase: '加價購'
        },
        mappingPaymentType: {
          Credit: '信用卡',
          WebATM: 'WebATM',
          ATM: 'ATM',
          CVS: '超商代碼繳款',
          BARCODE: '超商條碼繳款',
          CVSPickupPay: '超商取貨付款',
          StorePickupPay: '門市取貨付款'
        },
        mappingDeliveryCode: {
          HOME: '宅配',
          CVS: '超商取貨',
          STORE: '門市取貨'
        },
        mappingMarketCode: {
          FAMI: '全家',
          UNIMART: '7-11',
          HILIFE: '萊爾富',
          FAMIC2C: '全家',
          UNIMARTC2C: '7-11',
          HILIFEC2C: '萊爾富',
          OKMARTC2C: 'OK'
        }
      }
    }
  }
})));