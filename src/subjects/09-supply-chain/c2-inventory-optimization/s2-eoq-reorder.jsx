import React from 'react';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';

export default function Section_s2_eoq_reorder() {
  return (
    <SectionLayout
      title="Eoq Reorder"
      difficulty="intermediate"
      readingTime={30}
      prerequisites={[]}
    >
      <div className="space-y-6">
        <NoteBlock type="info" title="Coming Soon">
          <p>
            This section is under active development. Full content including
            theory, interactive visualizations, Python code examples, and
            practical exercises will be available soon.
          </p>
        </NoteBlock>
        
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Eoq Reorder
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            This section covers Eoq Reorder as part of the forecasting curriculum.
            Check back soon for the complete interactive content.
          </p>
        </section>
      </div>
    </SectionLayout>
  );
}
