// Content Collections - Type-safe content management
// Mimics Astro's Content Collections with Hugo data files
// This is a helper module for working with structured content

export function getCollection(collectionName) {
  return fetch(`/collections/${collectionName}.json`)
    .then(res => res.json())
    .catch(err => {
      console.error(`Failed to load collection: ${collectionName}`, err);
      return [];
    });
}

export function getEntry(collectionName, slug) {
  return getCollection(collectionName)
    .then(entries => entries.find(entry => entry.slug === slug))
    .catch(err => {
      console.error(`Failed to load entry: ${slug}`, err);
      return null;
    });
}

export function renderContent(content, format = 'markdown') {
  // Simple markdown renderer (in production, use a proper library)
  if (format === 'markdown') {
    return content
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');
  }
  return content;
}

// Example usage:
// const posts = await getCollection('posts');
// const post = await getEntry('posts', 'hello-world');
// const html = renderContent(post.content);
