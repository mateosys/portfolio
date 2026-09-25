import {defineField, defineType} from 'sanity'

export const journalEntry = defineType({
  name: 'journalEntry',
  title: 'Journal Entries',
  type: 'document',

  orderings: [
    {
      title: 'Entry date, newest first',
      name: 'dateDescending',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],

  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(500),
    }),

    defineField({
      name: 'speaker',
      title: 'Speaker',
      type: 'string',
      initialValue: 'Auspicious Stranger',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'date',
      title: 'Entry date',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'note',
      title: 'Private editing note',
      description: 'This field will not be displayed on the website.',
      type: 'text',
      rows: 3,
    }),
  ],

  preview: {
    select: {
      title: 'quote',
      speaker: 'speaker',
      date: 'date',
    },

    prepare({title, speaker, date}) {
      return {
        title,
        subtitle: `${date ?? 'No date'} — ${speaker ?? 'Unknown speaker'}`,
      }
    },
  },
})