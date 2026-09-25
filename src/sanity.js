import {createClient} from '@sanity/client'

export const sanityClient = createClient({
  projectId: 's59ikpqy',
  dataset: 'production',
  apiVersion: '2026-03-01',
  useCdn: true,
})