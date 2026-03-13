import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

const TEST_SCENARIOS = [
  { series: 'GDP growth rate', adf: 'Reject H₀ (p=0.002)', kpss: 'Do not reject H₀ (p=0.10)', conclusion: 'Stationary I(0)', color: 'green', icon: '✓' },
  { series: 'Log GDP level', adf: 'Do not reject H₀ (p=0.45)', kpss: 'Reject H₀ (p=0.01)', conclusion: 'Non-stationary I(1)', color: 'red', icon: '✗' },
  { series: 'Interest rate', adf: 'Do not reject H₀ (p=0.12)', kpss: 'Do not reject H₀ (p=0.08)', conclusion: 'Ambiguous — near unit root', color: 'yellow', icon: '?' },
  { series: 'Inflation rate', adf: 'Reject H₀ (p=0.04)', kpss: 'Reject H₀ (p=0.02)', conclusion: 'Conflicting — see note', color: 'orange', icon: '!' },
];

function TestOutcomeTable() {
  const [selected, setSelected] = useState(null);
  const colorMap = {
    green: 'bg-green-50 border-green-200 text-green-900',
    red: 'bg-red-50 border-red-200 text-red-900',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    orange: 'bg-orange-50 border-orange-200 text-orange-900',
  };
  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-5">
      <h3 className="text-lg font-semibold text-sky-900 mb-1">Interactive: Unit Root Test Outcomes</h3>
      <p className="text-sm text-sky-700 mb-4">Click a row to see the interpretation.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sky-200 text-sky-900">
              <th className="px-3 py-2 text-left">Series</th>
              <th className="px-3 py-2 text-left">ADF result</th>
              <th className="px-3 py-2 text-left">KPSS result</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {TEST_SCENARIOS.map((row, i) => (
              <tr key={i}
                onClick={() => setSelected(selected === i ? null : i)}
                className={`cursor-pointer border-b border-sky-100 transition-colors ${selected === i ? 'bg-sky-200' : 'hover:bg-sky-100'}`}
              >
                <td className="px-3 py-2 font-medium">{row.series}</td>
                <td className="px-3 py-2 text-xs">{row.adf}</td>
                <td className="px-3 py-2 text-xs">{row.kpss}</td>
                <td className="px-3 py-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colorMap[row.color]}`}>
                    {row.icon} {row.conclusion}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected !== null && (
        <div className={`mt-4 rounded-lg p-4 border ${colorMap[TEST_SCENARIOS[selected].color]}`}>
          <h4 className="font-semibold mb-2">{TEST_SCENARIOS[selected].series}</h4>
          <p className="text-sm">
            {selected === 0 && 'Both tests agree: ADF rejects the unit root null, and KPSS does not reject the stationarity null. The series is stationary I(0).'}
            {selected === 1 && 'Both tests agree: ADF fails to reject unit root, KPSS rejects stationarity. The series is integrated I(1). Apply first differencing.'}
            {selected === 2 && 'Both tests suggest non-rejection in their respective nulls. The series may be near-integrated (close to unit root boundary) or the tests lack power. Use longer samples or PP test for corroboration.'}
            {selected === 3 && 'Conflicting results: ADF says stationary, KPSS says non-stationary. This can occur with structural breaks in the series (both tests have low power under breaks), near-integration, or heteroskedasticity. Consider KPSS as more reliable here and apply differencing.'}
          </p>
        </div>
      )}
    </div>
  );
}

const PYTHON_CODE = `import numpy as np
import pandas as pd
from statsmodels.tsa.stattools import adfuller, kpss, PhillipsPerron

# ─── Load data ────────────────────────────────────────────────────────────────
url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/airline-passengers.csv"
df = pd.read_csv(url, index_col=0, parse_dates=True)
df.columns = ['passengers']
df.index.freq = 'MS'
y = np.log(df['passengers'])    # log-transform first (stabilise variance)

# ─── ADF Test ─────────────────────────────────────────────────────────────────
# H0: unit root present (non-stationary)
# Reject H0 -> stationary
adf_stat, adf_p, adf_lags, adf_n, adf_cv, adf_icbest = adfuller(y, autolag='AIC')
print("=" * 50)
print("Augmented Dickey-Fuller Test")
print("=" * 50)
print(f"  Test statistic : {adf_stat:.4f}")
print(f"  p-value        : {adf_p:.4f}")
print(f"  Lags used      : {adf_lags}")
print(f"  Critical values:")
for k, v in adf_cv.items():
    print(f"    {k}: {v:.4f}")
print(f"  Conclusion: {'Reject H0 (stationary)' if adf_p < 0.05 else 'Fail to reject H0 (unit root)'}")

# ─── KPSS Test ────────────────────────────────────────────────────────────────
# H0: series is stationary (OPPOSITE to ADF!)
# Reject H0 -> non-stationary
kpss_stat, kpss_p, kpss_lags, kpss_cv = kpss(y, regression='c', nlags='auto')
print("\\n" + "=" * 50)
print("KPSS Test (H0: stationarity)")
print("=" * 50)
print(f"  Test statistic : {kpss_stat:.4f}")
print(f"  p-value        : {kpss_p:.4f}")
print(f"  Lags used      : {kpss_lags}")
print(f"  Critical values:")
for k, v in kpss_cv.items():
    print(f"    {k}: {v:.4f}")
print(f"  Conclusion: {'Reject H0 (non-stationary)' if kpss_p < 0.05 else 'Fail to reject H0 (stationary)'}")

# ─── Now test the differenced series ─────────────────────────────────────────
dy = y.diff().dropna()
adf2 = adfuller(dy, autolag='AIC')
kpss2 = kpss(dy, regression='c', nlags='auto')
print("\\n--- First-differenced log-passengers ---")
print(f"ADF  p-value: {adf2[1]:.4f}  -> {'stationary' if adf2[1] < 0.05 else 'unit root'}")
print(f"KPSS p-value: {kpss2[1]:.4f} -> {'non-stationary' if kpss2[1] < 0.05 else 'stationary'}")
print("Conclusion: I(1) process confirmed — differencing once yields a stationary series.")
`;

export default function UnitRootTestsSection() {
  return (
    <SectionLayout
      title="Unit Root Tests"
      difficulty="intermediate"
      readingTime={35}
      prerequisites={['Stationarity Concepts']}
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Overview</h2>
          <p className="text-gray-700 leading-relaxed">
            Unit root tests provide a formal statistical framework for deciding whether a
            time series needs differencing before modelling. The most widely used are the
            Augmented Dickey-Fuller (ADF) test and the Kwiatkowski-Phillips-Schmidt-Shin
            (KPSS) test. Crucially, <strong>their null hypotheses are opposite</strong>: ADF
            tests the null of a unit root (non-stationarity), while KPSS tests the null of
            stationarity. Used together, they provide stronger evidence than either alone.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Augmented Dickey-Fuller Test</h2>
          <DefinitionBlock
            label="Definition 3.5"
            title="ADF Test"
            definition="The ADF test examines whether a unit root is present by estimating the regression Δy_t = α + βt + δy_{t-1} + Σ_j γ_j Δy_{t-j} + ε_t. The null hypothesis is H₀: δ = 0 (unit root). The test statistic τ = δ̂/SE(δ̂) has a non-standard limiting distribution (Dickey-Fuller distribution, not t). Critical values depend on the included deterministic terms."
            notation="\Delta y_t = \alpha + \beta t + \delta y_{t-1} + \sum_{j=1}^{p} \gamma_j \Delta y_{t-j} + \varepsilon_t"
          />
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-sky-100">
                  <th className="border border-sky-200 px-3 py-2">Specification</th>
                  <th className="border border-sky-200 px-3 py-2">Deterministics</th>
                  <th className="border border-sky-200 px-3 py-2">1% CV</th>
                  <th className="border border-sky-200 px-3 py-2">5% CV</th>
                  <th className="border border-sky-200 px-3 py-2">Use when</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['None', 'No constant, no trend', '-2.58', '-1.95', 'Series has no trend or drift'],
                  ['Constant', 'Intercept only', '-3.43', '-2.86', 'Series may have non-zero mean'],
                  ['Trend', 'Constant + linear trend', '-3.96', '-3.41', 'Series shows deterministic trend'],
                ].map(row => (
                  <tr key={row[0]} className="border-b border-sky-100 hover:bg-sky-50">
                    {row.map((c, i) => (
                      <td key={i} className={`border border-sky-200 px-3 py-2 ${i === 0 ? 'font-medium' : ''}`}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Reject <InlineMath math="H_0" /> (unit root) when the test statistic is more
            negative than the critical value. The lag order <InlineMath math="p" /> is
            typically selected by AIC or BIC.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">KPSS Test</h2>
          <DefinitionBlock
            label="Definition 3.6"
            title="KPSS Test"
            definition="The KPSS test decomposes the series as y_t = ξt + r_t + ε_t where ξt is a deterministic trend, r_t is a random walk with variance σ²_η, and ε_t is white noise. H₀: σ²_η = 0 (no random walk component = series is stationary). The test statistic is the normalised sum of squared partial sums of residuals."
            notation="\mathrm{KPSS} = \frac{1}{T^2}\sum_{t=1}^{T}\frac{S_t^2}{\hat{\sigma}^2}, \quad S_t = \sum_{s=1}^{t}\hat{\varepsilon}_s"
          />
          <NoteBlock type="warning" title="KPSS Null is the Opposite of ADF">
            The most common mistake with unit root tests is forgetting that ADF and KPSS
            have <strong>opposite null hypotheses</strong>:
            <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
              <li>ADF: <InlineMath math="H_0" /> = unit root (non-stationary). Reject → stationary.</li>
              <li>KPSS: <InlineMath math="H_0" /> = stationarity. Reject → non-stationary.</li>
            </ul>
            A small p-value in ADF is evidence FOR stationarity; a small p-value in KPSS
            is evidence AGAINST stationarity.
          </NoteBlock>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Phillips-Perron Test</h2>
          <DefinitionBlock
            label="Definition 3.7"
            title="Phillips-Perron (PP) Test"
            definition="The PP test is similar to ADF but uses a non-parametric correction for serial correlation in the errors (via a heteroskedasticity- and autocorrelation-consistent variance estimator) rather than augmenting with lagged differences. It shares the same null hypothesis as ADF (H₀: unit root) and the same Dickey-Fuller critical values."
            notation="\tilde{\tau} = \tau_{\hat{\delta}}\sqrt{\frac{\hat{\sigma}^2}{\hat{\lambda}^2}} - \frac{(\hat{\lambda}^2 - \hat{\sigma}^2)}{2\hat{\lambda}}\sqrt{\frac{T\sum x_t^2}{\hat{s}^2}}"
          />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Decision Rules</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-sky-100">
                  <th className="border border-sky-200 px-3 py-2">ADF outcome</th>
                  <th className="border border-sky-200 px-3 py-2">KPSS outcome</th>
                  <th className="border border-sky-200 px-3 py-2">Conclusion</th>
                  <th className="border border-sky-200 px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Reject H₀', 'Not reject H₀', 'Stationary I(0)', 'No differencing needed', 'bg-green-50'],
                  ['Not reject H₀', 'Reject H₀', 'Non-stationary I(1)', 'Apply first differencing', 'bg-red-50'],
                  ['Reject H₀', 'Reject H₀', 'Conflicting results', 'Check for structural breaks', 'bg-orange-50'],
                  ['Not reject H₀', 'Not reject H₀', 'Ambiguous (near I(0))', 'Apply differencing conservatively', 'bg-yellow-50'],
                ].map(([adf, kpss, conc, action, bg]) => (
                  <tr key={conc} className={`border-b border-sky-100 ${bg}`}>
                    <td className="border border-sky-200 px-3 py-2">{adf}</td>
                    <td className="border border-sky-200 px-3 py-2">{kpss}</td>
                    <td className="border border-sky-200 px-3 py-2 font-medium">{conc}</td>
                    <td className="border border-sky-200 px-3 py-2">{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <TestOutcomeTable />

        <WarningBlock title="Conflicting Test Results">
          <p>
            ADF and KPSS frequently produce conflicting results, especially when:
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
            <li><strong>Structural breaks</strong> are present — ADF has low power, KPSS may over-reject</li>
            <li>The series is <strong>near-integrated</strong> (φ close to but below 1)</li>
            <li>Sample size is small — both tests have low power</li>
            <li>The series has <strong>GARCH-type heteroskedasticity</strong></li>
          </ul>
          <p className="mt-2 text-sm">
            When tests conflict, it is generally safer to apply differencing and verify that
            the differenced series passes both tests. Over-differencing introduces
            a non-invertible MA component but is usually less harmful than using a
            non-stationary series in a stationary model.
          </p>
        </WarningBlock>

        <PythonCode
          title="ADF and KPSS Tests with statsmodels"
          code={PYTHON_CODE}
          runnable
        />

        <ReferenceList
          references={[
            {
              authors: 'Dickey, D.A. & Fuller, W.A.',
              year: 1979,
              title: 'Distribution of the estimators for autoregressive time series with a unit root',
              venue: 'Journal of the American Statistical Association, 74(366), 427–431',
              type: 'paper',
              whyImportant: 'Original paper deriving the non-standard Dickey-Fuller distribution under the unit root null hypothesis.',
            },
            {
              authors: 'Kwiatkowski, D., Phillips, P.C.B., Schmidt, P. & Shin, Y.',
              year: 1992,
              title: 'Testing the null hypothesis of stationarity against the alternative of a unit root',
              venue: 'Journal of Econometrics, 54(1–3), 159–178',
              type: 'paper',
              whyImportant: 'Introduces the KPSS test, which tests stationarity as the null — complementary to ADF.',
            },
            {
              authors: 'Phillips, P.C.B. & Perron, P.',
              year: 1988,
              title: 'Testing for a unit root in time series regression',
              venue: 'Biometrika, 75(2), 335–346',
              type: 'paper',
              whyImportant: 'Introduces the PP test with non-parametric serial correlation correction.',
            },
          ]}
        />
      </div>
    </SectionLayout>
  );
}
