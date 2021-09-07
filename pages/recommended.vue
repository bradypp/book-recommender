<template>
  <main class="relative">
    <div class="block w-full">
      <!-- Have colours for this section be themed based on searched for book -->
      <div>you searched for (have cover image & title, series & authors)</div>
      <div>filters</div>
      <div>
        genres (dropdown select), number of ratings (2 inputs), rating (2 inputs), number of pages
        (1 inputs), release year (2 inputs), sort (recommended, number of ratings, ratings)
      </div>
      <div>
        include books from same author (checkbox), include books in same series (checkbox), include
        books in a series (checkbox)
      </div>
      <div>buttons - new search & advanced filters</div>
    </div>
    <RecommendedBooks />
  </main>
</template>

<script>
export default {};
</script>
