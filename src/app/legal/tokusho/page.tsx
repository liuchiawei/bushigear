// 特定商取引法に基づく表記ページ
export default function TokushoPage() {
  return (
    <main className="w-full min-h-screen py-16">
      <div className="w-full max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">特定商取引法に基づく表記</h1>

        <div className="bg-white border rounded-lg p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">販売業者名</h2>
            <p className="text-gray-700">ブシギア（BUSHIGEAR）</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">運営責任者名</h2>
            <p className="text-gray-700">代表責任者</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">所在地</h2>
            <p className="text-gray-700">
              〒160-0023
              <br />
              東京都新宿区西新宿1-7-3
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">連絡先</h2>
            <div className="text-gray-700 space-y-2">
              <p>
                <strong>電話番号:</strong> 070-777-8888
              </p>
              <p>
                <strong>受付時間:</strong> 9:00 - 18:00（月〜金）
                <br />
                <span className="ml-6">土日祝休み</span>
              </p>
              <p>
                <strong>メールアドレス:</strong> info@bushi-gear.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">販売価格</h2>
            <p className="text-gray-700">
              各商品ページに記載の価格（消費税込み）
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">商品代金以外の必要料金</h2>
            <div className="text-gray-700 space-y-2">
              <p>
                <strong>送料:</strong> 全国一律500円（5,000円以上のご購入で送料無料）
              </p>
              <p>
                <strong>手数料:</strong> クレジットカード決済手数料はお客様のご負担となります
              </p>
              <p>
                <strong>消費税:</strong> 商品価格に含まれています
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">支払方法および支払時期</h2>
            <div className="text-gray-700 space-y-2">
              <p>
                <strong>支払方法:</strong> クレジットカード決済（Visa、MasterCard、American Express、JCB）
              </p>
              <p>
                <strong>支払時期:</strong> ご注文時にお支払いが確定します
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">商品の引渡時期</h2>
            <p className="text-gray-700">
              ご注文確認後、3営業日以内に発送いたします。
              <br />
              （在庫状況により、発送が遅れる場合がございます。その場合は事前にご連絡いたします）
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">返品・キャンセルについて</h2>
            <div className="text-gray-700 space-y-3">
              <div>
                <h3 className="font-semibold mb-2">返品・交換について</h3>
                <p>
                  商品到着後7日以内に限り、未使用・未開封の商品に限り返品・交換を受け付けます。
                  <br />
                  返品・交換をご希望の場合は、事前にメールまたはお電話でご連絡ください。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">返品送料</h3>
                <p>
                  お客様都合による返品の場合、返品送料はお客様のご負担となります。
                  <br />
                  不良品・誤配送の場合は、当社が負担いたします。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">キャンセルについて</h3>
                <p>
                  ご注文確定後、商品発送前であればキャンセル可能です。
                  <br />
                  商品発送後のキャンセルはお受けできません。返品手続きをご利用ください。
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">返金について</h3>
                <p>
                  返品が確認され次第、7営業日以内にご指定の口座へ返金いたします。
                  <br />
                  返金手数料は当社が負担いたします。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">その他</h2>
            <div className="text-gray-700 space-y-2">
              <p>
                本サイトは、Stripe の安全な決済システムを使用しています。
                <br />
                クレジットカード情報は当社では保存されません。
              </p>
              <p>
                ご不明な点がございましたら、お気軽にお問い合わせください。
              </p>
            </div>
          </section>

          <div className="pt-6 border-t mt-6">
            <p className="text-sm text-gray-500 text-center">
              最終更新日: 2025年1月
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

