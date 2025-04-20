import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="text-center">
      +  <h1 className="text-3xl font-bold text-gray-800 mb-4">Kansalaissäästöaloite.fi</h1>

+  {/* Mission statement, inspired by “Start with Why” */}
+  <p className="text-lg text-gray-700 mb-6">
+    Me uskomme, että parempaa yhteistä tulevaisuutta rakennetaan yhteisillä teoilla. 
+    Siksi tarjoamme alustan, jossa jokainen voi nostaa esiin älykkäitä säästöaloitteita 
+    ja vaikuttaa siihen, miten julkisia varoja käytetään.
+  </p>

      <Link
        to="/ilmoita"
        className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg mt-6 hover:bg-blue-800 transition"
      >
        Tee säästöaloite
      </Link>
    </div>
  )
}
