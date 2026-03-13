import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import TheoremBlock from '../../../components/content/TheoremBlock.jsx';
import DefinitionBlock from '../../../components/content/DefinitionBlock.jsx';
import ExampleBlock from '../../../components/content/ExampleBlock.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';
import WarningBlock from '../../../components/content/WarningBlock.jsx';
import PythonCode from '../../../components/content/PythonCode.jsx';
import ReferenceList from '../../../components/content/ReferenceList.jsx';

const INDUSTRY_APPLICATIONS = [
  { industry: 'Retail & E-commerce', variable: 'Product demand', horizon: 'Days to weeks', method: 'Exponential smoothing, ML', impact: 'Reduced inventory cost and stockouts' },
  { industry: 'Energy', variable: 'Electricity load', horizon: 'Hours to days', method: 'ARIMA, neural networks', impact: 'Grid stability and dynamic pricing' },
  { industry: 'Finance', variable: 'Asset prices, volatility', horizon: 'Minutes to months', method: 'GARCH, factor models', impact: 'Risk management and trading decisions' },
  { industry: 'Healthcare', variable: 'Patient admissions, disease incidence', horizon: 'Days to months', method: 'Epidemic models, regression', impact: 'Staffing and resource allocation' },
  { industry: 'Logistics', variable: 'Shipping volume, transit time', horizon: 'Days to weeks', method: 'Regression, gradient boosting', impact: 'Route optimisation and capacity planning' },
  { industry: 'Meteorology', variable: 'Temperature, precipitation', horizon: 'Hours to 10 days', method: 'NWP, ensemble models', impact: 'Agriculture, safety, and event management' },
  { industry: 'Government', variable: 'GDP, tax revenue, population', horizon: 'Quarters to years', method: 'Structural macro models', impact: 'Policy-setting and budget planning' },
  { industry: 'Manufacturing', variable: 'Production output, defect rates', horizon: 'Weeks to months', method: 'ARIMA, causal models', impact: 'Scheduling and quality control' },
];

function IndustryTable() {
  const [selected, setSelected] = useState(null);
  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
      <h3 className="mb-1 text-lg font-semibold text-sky-900">Forecasting Applications by Industry</h3>
      <p className="mb-3 text-sm text-sky-700">Click a row to see additional details.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sky-200 text-sky-900">
              <th className="px-3 py-2 text-left font-semibold">Industry</th>
              <th className="px-3 py-2 text-left font-semibold">Variable</th>
              <th className="px-3 py-2 text-left font-semibold">Horizon</th>
              <th className="px-3 py-2 text-left font-semibold">Methods</th>
            </tr>
          </thead>
          <tbody>
            {INDUSTRY_APPLICATIONS.map((row, i) => (
              <tr
                key={i}
                onClick={() => setSelected(selected === i ? null : i)}
                className={`cursor-pointer border-b border-sky-100 transition-colors ${selected === i ? 'bg-sky-300 text-sky-900' : 'hover:bg-sky-100'}`}
              >
                <td className="px-3 py-2 font-medium">{row.industry}</td>
                <td className="px-3 py-2">{row.variable}</td>
                <td className="px-3 py-2">{row.horizon}</td>
                <td className="px-3 py-2">{row.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected !== null && (
        <div className="mt-4 rounded-lg bg-white p-4 shadow-sm border border-sky-200">
          <h4 className="font-semibold text-sky-800">{INDUSTRY_APPLICATIONS[selected].industry} — Business Impact</h4>
          <p className="mt-1 text-sky-700"><span className="font-medium">Impact: </span>{INDUSTRY_APPLICATIONS[selected].impact}</p>
          <p className="mt-1 text-sky-700"><span className="font-medium">Horizon: </span>{INDUSTRY_APPLICATIONS[selected].horizon}</p>
          <p className="mt-1 text-sky-700"><span className="font-medium">Methods: </span>{INDUSTRY_APPLICATIONS[selected].method}</p>
        </div>
      )}
    </div>
  );
}

const PYTHON_CODE = `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load the classic airline passengers dataset
url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/airline-passengers.csv"
df = pd.read_csv(url, header=0, index_col=0, parse_dates=True)
df.columns = ['passengers']
df.index.freq = 'MS'  # Monthly start frequency

print(df.head(12))
print(f"\\nShape: {df.shape}")
print(f"Date range: {df.index[0]} to {df.index[-1]}")
print(f"\\nSummary statistics:")
print(df.describe())

# Visualise the series
fig, axes = plt.subplots(2, 1, figsize=(12, 8))

axes[0].plot(df.index, df['passengers'], color='steelblue', linewidth=1.5)
axes[0].set_title('Monthly Airline Passengers (1949-1960)', fontsize=14)
axes[0].set_ylabel('Passengers (thousands)')
axes[0].grid(alpha=0.3)

# Log-transform to stabilise variance
axes[1].plot(df.index, np.log(df['passengers']), color='darkorange', linewidth=1.5)
axes[1].set_title('Log-Transformed Series (variance-stabilised)', fontsize=14)
axes[1].set_ylabel('log(Passengers)')
axes[1].grid(alpha=0.3)

plt.tight_layout()
plt.show()

# Simple train / test split (no data leakage)
train = df.iloc[:-12]   # everything except the last year
test  = df.iloc[-12:]   # hold out the last 12 months

print(f"\\nTraining observations : {len(train)}")
print(f"Test observations     : {len(test)}")
`;

export default function WhatIsForecastingSection() {
  return (
    <SectionLayout
      title="What is Forecasting?"
      difficulty="beginner"
      readingTime={20}
      prerequisites={[]}
    >
      <div className="space-y-6">
        <NoteBlock type="historical" title="A Brief History of Forecasting">
          <p>
            Formal time series analysis traces back to Yule (1927) and Slutsky (1937), who
            studied autoregressive processes in economic data. The field was transformed by{' '}
            <strong>Box and Jenkins</strong> (1970), whose iterative ARIMA modelling cycle —
            identification, estimation, diagnostic checking — remains the dominant framework today.
          </p>
          <p className="mt-2">
            Modern practice was further shaped by <strong>Rob Hyndman</strong>, whose{' '}
            <em>Forecasting: Principles and Practice</em> textbook and the M-competitions
            (1982–2020) provide both a pedagogical foundation and empirical benchmarks for
            evaluating methods at scale.
          </p>
        </NoteBlock>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Forecasting is the process of making probabilistic statements about events whose
            outcomes have not yet been observed. It combines statistical theory, domain knowledge,
            and computation to quantify uncertainty about the future. Almost every substantive
            business decision — ordering inventory, setting interest rates, scheduling staff —
            implicitly or explicitly relies on a forecast.
          </p>
        </section>

        <DefinitionBlock
          label="Definition 1.1"
          title="Forecast"
          definition="A forecast is a probabilistic statement about a future value of a random variable, conditioned on all information available at the forecast origin. The forecast origin t is the last period for which observations exist; the forecast horizon h is the number of periods ahead."
          notation="\hat{y}_{t+h \mid t} \text{ denotes the h-step-ahead forecast made at time } t"
        />

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Forecasting vs Prediction vs Projection</h2>
          <p className="text-gray-700 mb-4">
            These three terms are often used interchangeably in everyday speech but carry distinct
            technical meanings in quantitative work.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { term: 'Forecast', desc: 'A probabilistic statement about a specific future value produced by a quantitative model fitted to historical data. Forecasts always come with an associated uncertainty measure.', example: '"We forecast 1,200 units next month (95% PI: 950–1,450)."' },
              { term: 'Prediction', desc: 'A broader term for any claim about an unknown quantity. In machine learning, "prediction" often refers to model output without explicit temporal context or uncertainty quantification.', example: '"The model predicts this customer will churn."' },
              { term: 'Projection', desc: 'A conditional forecast stating what would happen if specified assumptions hold. Common in demography and macro-economics.', example: '"Under current policy, GDP grows 2.5% annually to 2030."' },
            ].map(({ term, desc, example }) => (
              <div key={term} className="rounded-lg border border-sky-200 bg-sky-50 p-4">
                <h3 className="font-bold text-sky-900 text-lg mb-2">{term}</h3>
                <p className="text-sky-800 text-sm mb-2">{desc}</p>
                <p className="text-sky-600 text-xs italic">{example}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Types of Forecasts</h2>
          <p className="text-gray-700 mb-4">
            Forecasts differ in how completely they characterise uncertainty. A full
            probabilistic treatment is nearly always preferable to a single point estimate.
          </p>
          <DefinitionBlock
            label="Definition 1.2"
            title="Point Forecast"
            definition="A point forecast is a single value representing the 'best guess' of the future observation. The optimal point forecast under squared-error loss is the conditional mean; under absolute-error loss it is the conditional median."
            notation="\hat{y}_{t+h|t} = \mathbb{E}[y_{t+h} \mid \mathcal{F}_t]"
          />
          <DefinitionBlock
            label="Definition 1.3"
            title="Prediction Interval"
            definition="A (1-α) prediction interval [L, U] is a random interval constructed so that the true future value falls within it with probability 1-α over repeated applications. Unlike a confidence interval, it must account for both parameter uncertainty and the inherent randomness of the future observation."
            notation="P\!\left(L_{t+h} \le y_{t+h} \le U_{t+h}\right) = 1 - \alpha"
          />
          <DefinitionBlock
            label="Definition 1.4"
            title="Density Forecast"
            definition="A density forecast provides a complete predictive probability distribution f(y_{t+h} | F_t) for the future value. It is the most informative forecast type and subsumes point and interval forecasts as special cases (e.g., the mean of the density, or any quantile pair)."
            notation="f\!\left(y_{t+h} \mid \mathcal{F}_t\right)"
          />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-sky-900 mb-3">Forecast Horizons</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-sky-100">
                  <th className="border border-sky-200 px-4 py-2 text-left">Horizon</th>
                  <th className="border border-sky-200 px-4 py-2 text-left">Duration</th>
                  <th className="border border-sky-200 px-4 py-2 text-left">Examples</th>
                  <th className="border border-sky-200 px-4 py-2 text-left">Typical Methods</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Short-term', 'Hours to weeks', 'Weather, electricity load, inventory replenishment', 'ARIMA, exponential smoothing, ML'],
                  ['Medium-term', 'Weeks to 2 years', 'Sales planning, staffing, capital budgeting', 'ETS, regression, gradient boosting'],
                  ['Long-term', '2+ years', 'Population, infrastructure, climate', 'Structural models, scenario analysis'],
                ].map(([h, d, e, m]) => (
                  <tr key={h} className="border-b border-sky-100 hover:bg-sky-50">
                    <td className="border border-sky-200 px-4 py-2 font-medium">{h}</td>
                    <td className="border border-sky-200 px-4 py-2">{d}</td>
                    <td className="border border-sky-200 px-4 py-2">{e}</td>
                    <td className="border border-sky-200 px-4 py-2">{m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <NoteBlock type="tip" title="Forecast Uncertainty Grows with Horizon">
          For most processes, forecast variance increases monotonically with the horizon h.
          For a random walk <InlineMath math="y_t = y_{t-1} + \varepsilon_t" />, the h-step
          variance is <InlineMath math="h\sigma^2" />. Even for stationary AR processes the
          variance converges to the unconditional variance as <InlineMath math="h \to \infty" />.
          Always report prediction intervals — they communicate this irreducible uncertainty.
        </NoteBlock>

        <IndustryTable />

        <PythonCode
          title="Loading and Exploring a Time Series with pandas"
          code={PYTHON_CODE}
          runnable
        />

        <ReferenceList
          references={[
            {
              authors: 'Hyndman, R.J. & Athanasopoulos, G.',
              year: 2021,
              title: 'Forecasting: Principles and Practice (3rd ed.)',
              venue: 'OTexts',
              type: 'book',
              whyImportant: 'The primary reference for this course. Free at otexts.com/fpp3. Covers the full forecasting workflow from exploratory analysis to deployment.',
            },
            {
              authors: 'Box, G.E.P. & Jenkins, G.M.',
              year: 1970,
              title: 'Time Series Analysis: Forecasting and Control',
              venue: 'Holden-Day',
              type: 'book',
              whyImportant: 'The seminal text introducing the ARIMA modelling framework and the iterative model-building cycle that underpins most of modern time series analysis.',
            },
            {
              authors: 'Makridakis, S., Spiliotis, E. & Assimakopoulos, V.',
              year: 2020,
              title: 'The M4 Competition: 100,000 time series and 61 forecasting methods',
              venue: 'International Journal of Forecasting, 36(1), 54–74',
              type: 'paper',
              whyImportant: 'Largest forecasting competition to date. Key finding: combination methods and ML hybrids consistently outperform individual models, but simple benchmarks are hard to beat.',
            },
          ]}
        />
      </div>
    </SectionLayout>
  );
}
