import React from 'react';
import SectionLayout from '../../../components/content/SectionLayout.jsx';
import NoteBlock from '../../../components/content/NoteBlock.jsx';

export default function Section_s3_seq2seq() {
  return (
    <SectionLayout
      title="Seq2seq"
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
            Seq2seq
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            This section covers Seq2seq as part of the forecasting curriculum.
            Check back soon for the complete interactive content.
          </p>
        </section>
      </div>
    </SectionLayout>
  );
}
