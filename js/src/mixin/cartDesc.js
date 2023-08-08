(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.cartDescMixin = factory());
}(this, (function () {
  return {
    data() {
			return {
				paymentLimit: `
					<p>1.宅配配送：</p>
					<div class="pl-2">
						<p>(1)信用卡：$33<= 付款金額 <= $199,999</p>
						<p>(2)WebATM/ATM ：$11<= 付款金額 <= $49,999</p>
						<p>(3)超商代碼：$33<= 付款金額 <= $20,000</p>
						<p>(4)超商條碼：$17< =付款金額 <= $20,000</p>
					</div>
					<p>2.超商取貨：付款金額 <= $20,000</p>
					<p>3.ATM付款：ATM付款產生之虛擬帳號，僅能使用ATM櫃員機及網路銀行轉帳，無法臨櫃轉帳付款。</p>
				`,
				warningText: `
					<li>※因拍攝燈光、電腦解析度、電腦螢幕廠牌不同，實品與網頁上商品可能會有些許色差。</li>
					<li>※商品包裝會隨著廠商而不定時更換新包裝，商品依實際出貨為準。</li>
					<li>※商品如遇缺貨/停產/訂單相關問題，客服會與您聯繫【MAIL/電話/簡訊】取消或變更訂單。</li>
					<li>※如購買大量-配送方式選擇【超商取貨】，請先與客服確認是否可配送【超商有材積/重量限制】。</li>
					<li>※您要結帳的商品若與您所選取的付款方式或寄送方式不相符將無法在同一訂單內結帳。</li>
					<li>※若商品僅加入購物車，系統不會保留商品。需完成訂單填寫且訂單成立才會予以保留。</li>
					<li>※本網站不會主動打電話要求您操作ATM或透露存款餘額，若您接到類似可疑電話，請撥打165專線確認，以確保您的權益。</li>
					<li>※如有其他問題，請先參考頁面下方【購物說明】。</li>
				`,
				preorderPaymentLimit: `
					<div class="pl-2">
						<p>(1)信用卡：$33<= 付款金額 <= $199,999</p>
						<p>(2)WebATM/ATM ：$11<= 付款金額 <= $49,999</p>
						<p>(3)超商代碼：$33<= 付款金額 <= $20,000</p>
						<p>(4)超商條碼：$17< =付款金額 <= $20,000</p>
					</div>
				`,
			}
		}
  }
})));