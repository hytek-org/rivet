import type { HttpMethod } from '../http/types'

export interface ApiCatalogueItem {
  id: string
  name: string
  category: 'development' | 'weather' | 'social' | 'commerce' | 'reference'
  method: HttpMethod
  url: string
  description: string
  tags: string[]
  sampleParams?: Array<{ key: string; value: string; enabled: boolean }>
  sampleBody?: string
  corsSupport: 'Full' | 'Public Open'
}

export const CATALOGUE_CATEGORIES = [
  { id: 'all', label: 'All Endpoints' },
  { id: 'development', label: 'Development & Testing' },
  { id: 'weather', label: 'Weather & Geospatial' },
  { id: 'social', label: 'Social & Identity' },
  { id: 'commerce', label: 'E-Commerce & Products' },
  { id: 'reference', label: 'Reference & Data' },
] as const

/**
 * Curated catalogue of verified, live, CORS-enabled public APIs.
 * Note: These are honest public endpoints that support direct browser fetch requests.
 */
export const CURATED_ENDPOINTS: ApiCatalogueItem[] = [
  {
    id: 'jsonplaceholder-posts-get',
    name: 'List Posts',
    category: 'development',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts',
    description:
      'Fetch a collection of sample blog posts. Supports filtering by userId and query params.',
    tags: ['posts', 'content', 'rest'],
    sampleParams: [
      { key: '_limit', value: '10', enabled: true },
      { key: '_page', value: '1', enabled: true },
    ],
    corsSupport: 'Full',
  },
  {
    id: 'jsonplaceholder-single-post',
    name: 'Get Single Post',
    category: 'development',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    description:
      'Retrieve a specific post entity by identifier with title and body text.',
    tags: ['posts', 'single'],
    corsSupport: 'Full',
  },
  {
    id: 'jsonplaceholder-create-post',
    name: 'Create Post',
    category: 'development',
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts',
    description:
      'Simulate creating a new post record. Returns status 201 with the created entity and ID.',
    tags: ['create', 'post', 'payload'],
    sampleBody: JSON.stringify(
      {
        title: 'Testing Rivet API Workspace',
        body: 'Building and sending HTTP payloads client-side.',
        userId: 1,
      },
      null,
      2,
    ),
    corsSupport: 'Full',
  },
  {
    id: 'jsonplaceholder-update-todo',
    name: 'Update Todo Item',
    category: 'development',
    method: 'PUT',
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    description:
      'Update the title and completion state of an existing todo task.',
    tags: ['todos', 'put', 'update'],
    sampleBody: JSON.stringify(
      {
        id: 1,
        title: 'Review Rivet documentation',
        completed: true,
        userId: 1,
      },
      null,
      2,
    ),
    corsSupport: 'Full',
  },
  {
    id: 'jsonplaceholder-patch-post',
    name: 'Patch Post Title',
    category: 'development',
    method: 'PATCH',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    description:
      'Perform a partial update on a resource without replacing the entire entity.',
    tags: ['patch', 'partial-update'],
    sampleBody: JSON.stringify(
      {
        title: 'Updated title via Rivet PATCH',
      },
      null,
      2,
    ),
    corsSupport: 'Full',
  },
  {
    id: 'jsonplaceholder-delete-post',
    name: 'Delete Post',
    category: 'development',
    method: 'DELETE',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    description:
      'Send a DELETE request for a post resource. Expects a 200 OK empty response.',
    tags: ['delete', 'cleanup'],
    corsSupport: 'Full',
  },
  {
    id: 'open-meteo-forecast',
    name: 'Live Weather Forecast',
    category: 'weather',
    method: 'GET',
    url: 'https://api.open-meteo.com/v1/forecast',
    description:
      'Open-access global weather forecast API requiring no API key. Returns live temperature and wind speed.',
    tags: ['weather', 'forecast', 'coordinates'],
    sampleParams: [
      { key: 'latitude', value: '40.7128', enabled: true },
      { key: 'longitude', value: '-74.0060', enabled: true },
      { key: 'current', value: 'temperature_2m,wind_speed_10m', enabled: true },
    ],
    corsSupport: 'Full',
  },
  {
    id: 'github-user-octocat',
    name: 'GitHub User Profile',
    category: 'social',
    method: 'GET',
    url: 'https://api.github.com/users/octocat',
    description:
      'Inspect public GitHub user metadata, repository counts, followers, and profile details.',
    tags: ['github', 'profile', 'git'],
    corsSupport: 'Full',
  },
  {
    id: 'github-public-emojis',
    name: 'GitHub Emoji Directory',
    category: 'social',
    method: 'GET',
    url: 'https://api.github.com/emojis',
    description:
      'List all available custom and Unicode emoji identifiers supported on GitHub.',
    tags: ['github', 'emojis', 'reference'],
    corsSupport: 'Full',
  },
  {
    id: 'dummyjson-products',
    name: 'Product Catalog',
    category: 'commerce',
    method: 'GET',
    url: 'https://dummyjson.com/products',
    description:
      'Browse a catalog of mock e-commerce items complete with prices, ratings, and stock levels.',
    tags: ['storefront', 'items', 'commerce'],
    sampleParams: [
      { key: 'limit', value: '5', enabled: true },
      { key: 'skip', value: '0', enabled: true },
    ],
    corsSupport: 'Full',
  },
  {
    id: 'dummyjson-add-product',
    name: 'Add Product Item',
    category: 'commerce',
    method: 'POST',
    url: 'https://dummyjson.com/products/add',
    description:
      'Submit an e-commerce product creation payload with title, category, and unit price.',
    tags: ['commerce', 'add', 'post'],
    sampleBody: JSON.stringify(
      {
        title: 'Precision Mechanical Caliper',
        category: 'tools',
        price: 49.99,
        stock: 120,
      },
      null,
      2,
    ),
    corsSupport: 'Full',
  },
  {
    id: 'pokeapi-pokemon-ditto',
    name: 'Pokémon Entity Lookup',
    category: 'reference',
    method: 'GET',
    url: 'https://pokeapi.co/api/v2/pokemon/ditto',
    description:
      'Educational RESTful Pokémon resource with abilities, base experience, and game indexes.',
    tags: ['pokemon', 'reference', 'gaming'],
    corsSupport: 'Full',
  },
  {
    id: 'restcountries-all',
    name: 'REST Countries Directory',
    category: 'reference',
    method: 'GET',
    url: 'https://restcountries.com/v3.1/name/canada',
    description:
      'Query country information such as capital city, official currencies, languages, and flag vectors.',
    tags: ['countries', 'geography', 'reference'],
    corsSupport: 'Full',
  },
  {
    id: 'httpbin-status-codes',
    name: 'HTTP Status 404 Simulation',
    category: 'development',
    method: 'GET',
    url: 'https://dummyjson.com/http/404',
    description:
      'Verify client error response handling when the remote server returns a 404 Not Found response.',
    tags: ['errors', '404', 'http-status'],
    corsSupport: 'Full',
  },
  {
    id: 'jsonplaceholder-users-list',
    name: 'User Directory',
    category: 'social',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/users',
    description:
      'Returns list of sample user accounts with nested address, geolocation, and company details.',
    tags: ['users', 'directory'],
    corsSupport: 'Full',
  },
]
