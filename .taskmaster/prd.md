# Product Requirements Document: BookMatch - Personalized Book Recommendation System

## 1. Executive Summary

BookMatch is a sophisticated book recommendation system that allows users to receive personalized book recommendations based on their reading preferences. Users can upload their Goodreads data in CSV format or specify custom filters to receive tailored book recommendations. The system leverages advanced AI models and vector embeddings to provide accurate and diverse recommendation types, from general recommendations to mood-based suggestions and character archetype matches[1][2].

## 2. Product Vision

BookMatch aims to revolutionize how readers discover new books by providing highly personalized recommendations that truly understand their reading preferences and habits. By combining the power of vector embeddings with flexible recommendation angles, BookMatch will help readers find their next favorite book with unprecedented accuracy and delight[3][4].

## 3. Target Audience

- Avid readers looking to discover new books aligned with their tastes
- Goodreads users who want more sophisticated recommendation options
- Book club members seeking diverse reading suggestions
- Readers interested in exploring specific book elements or character archetypes
- Users who want AI-powered analysis of their reading habits and preferences[5][6]

## 4. User Requirements

### 4.1 Data Input and Preference Specification

Users should be able to:

- Upload their Goodreads library data in CSV format[5][7]
- Specify custom filters including:
  - Favorite books
  - Preferred authors
  - Genres of interest
  - Publication date ranges
  - Rating thresholds
  - Page count preferences[6][8]

### 4.2 Recommendation Angle Refinement

Users should be able to select from various recommendation types:

- General recommendations based on overall reading history
- Mood-based recommendations (e.g., uplifting, thought-provoking, escapist)
- Book element-based recommendations (e.g., plot-driven, character-focused)
- Anti-recommendations (books to avoid based on disliked patterns)
- Character archetype match (books featuring specific character types)
- Book-to-everything converter (finding books similar to movies, TV shows, etc.)
- Personal critic (recommendations with personalized review predictions)
- Filtered Goodreads data analysis
- "What if" scenarios (e.g., "What if this author wrote in a different genre?")
- Hidden gems (lesser-known books matching user preferences)[3][4][9]

### 4.3 Recommendation Output

Users should receive:

- Detailed recommendations formatted in a consistent Markdown file
- Each recommendation should include:
  - Book title, author, and cover image
  - Publication details
  - Brief synopsis
  - Reasoning for the recommendation
  - Similarity score to user preferences
  - Links to purchase or find the book[2][3]

### 4.4 AI Profile Analysis

Users should receive:

- Comprehensive analysis of their reading habits
- Identification of patterns in genre preferences
- Author preference analysis
- Reading pace and volume statistics
- Mood and theme preferences
- Visualization of reading trends over time[8][9]

### 4.5 Account Management

Users should be able to:

- Sign up and log in using email/password or social authentication
- Save their uploaded data and preferences
- View and manage their search history
- Access past recommendations
- Update their profile information
- Delete their account and data if desired[10][11][12]

### 4.6 Model Choice

Users should be able to:

- Use the free default open-source model (DeepSeek R1)
- Provide their own API keys for premium AI models:
  - OpenAI
  - Anthropic
  - Gemini
  - XAI
  - Perplexity
- Purchase premium recommendations (to use premium models) using Stripe payment integration[13][14][15]

## 5. System Requirements

### 5.1 Architecture

The system will follow a microservice architecture with:

- Next.js front-end application
- Supabase for user management and data storage
- Modular services for different system functions
- RESTful APIs for communication between services[16][17][18][19]

### 5.2 Front-End

- Built with Next.js framework
- Styled using HeroUI components
- Themed with Goodreads colors and style (beige, brown, and green palette)
- Responsive design for mobile and desktop
- Accessible interface following WCAG guidelines[17][20][19]

### 5.3 Back-End

- CSV parsing service to process Goodreads data
- Data storage in Supabase PostgreSQL database
- Vector embedding generation using transformers.js
- Vector storage using Supabase pgvector extension
- Integration with multiple AI models through a unified API interface[21][10][22][15]

### 5.4 Authentication and Authorization

- User authentication via Supabase Auth
- JWT-based session management
- Role-based access control
- Optional sign-in with saving functionality requiring authentication[10][11][12]

### 5.5 Data Processing

- Parsing and validation of CSV file data
- Extract data for each book including:
  - Book Id,Title,Author,Author l-f,Additional Authors,ISBN,ISBN13,My Rating,Average Rating,Publisher,Binding,Number of Pages,Year Published,Original Publication Year,Date Read,Date Added,Bookshelves,Bookshelves with positions,Exclusive Shelf,My Review,Spoiler,Private Notes,Read Count,Owned Copies
- Generation of vector embeddings for the books
- Storage of structured data in appropriate database tables[5][6][21]
- The personalised data for each book (such as my rating, date read, date added, bookshelves, my review etc) should be stored per user to easily generate personalized recommendations
- Each book should have a unique entry separate from the user to allow for lookup of books independent of users

### 5.6 Recommendation Engine

- Integration with AI models for generating recommendations based off filters
- Customizable recommendation algorithms based on selected angle
- Caching mechanism for frequently requested recommendations[3][4][23][8]

### 5.7 Payment Integration (later phase)

- Stripe integration for processing payments
- Subscription management for premium features
- Secure handling of payment information
- Receipt generation and transaction history[13]

## 6. User Flow

### 6.1 Home Page

- Welcome message and brief explanation of the service
- Two primary options:
  - Upload Goodreads CSV file
  - Specify custom filters manually
- Optional sign-in/sign-up buttons
- Examples of recommendation outputs[5][6][7]

### 6.2 Data Input

#### 6.2.1 CSV Upload

- Drag-and-drop interface for CSV upload
- Validation of file format
- Preview of detected data
- Option to edit or correct detected information[5][7]

#### 6.2.2 Manual Filter Specification

- Form interface for entering preferences
- Book search functionality with autocomplete
- Author and genre selection with suggestions
- Sliders for rating and page count preferences[6][8]

### 6.3 Recommendation Angle Selection

- Visual selection interface for recommendation angles
- Brief explanation of each angle type
- Option to combine multiple angles
- Preview of how each angle affects recommendations[3][4][9]

### 6.4 Model Selection

- Default selection of free open-source model (DeepSeek R1)
- Options to:
  - Enter API keys for premium models
  - Purchase premium recommendations via Stripe (later phase)
- Explanation of benefits for each model option[14][15]

### 6.5 Recommendation Generation

- Loading screen with progress indication
- Display of generated recommendations
- Options to:
  - Save recommendations
  - Export as Markdown
  - Share recommendations
  - Refine search parameters[3][4]

### 6.6 RAG Interface

- Chat interface for interacting with recommendations
- Ability to ask questions about recommended books
- Option to request alternative recommendations
- Feedback mechanism for improving future recommendations[24][21][15]

## 7. Technical Architecture

### 7.1 Microservices

The system will be composed of the following microservices:

- User Service: Handles user authentication and profile management
- Upload Service: Processes and validates CSV uploads
- Embedding Service: Generates vector embeddings for books
- Recommendation Service: Processes recommendation requests
- Payment Service: Handles Stripe payment integration (later phase)
- Export Service: Generates formatted recommendation outputs[16][18][19]

### 7.2 Data Model

#### 7.2.1 User Table

- user_id (primary key)
- email
- password (hashed)
- created_at
- last_login
- subscription_status

#### 7.2.2.1 User_CSV Table

- user_csv_id (primary key)
- user_id (foreign key)
- user_book_id (foreign key)
- csv_file_name
- csv_file_path
- upload_date
- processed (boolean)

#### 7.2.2.2 User_Books Table

- user_book_id (primary key)
- user_id (foreign key)
- book_id (foreign key)
- user_rating
- review_text
- shelves
- date_added
- date_read
- spoiler (boolean)
- private_notes
- exclusive_shelf
- read_count
- owned_copies

#### 7.2.3 Books Table

- book_id (primary key)
- title
- author
- isbn
- isbn13
- additional_authors
- publisher
- binding
- original_publication_year
- publication_date
- page_count
- genres
- average_rating
- description
- cover_image_url

#### 7.2.4.1 User_Books_Embeddings Table

- embedding_id (primary key)
- user_book_id (foreign key)
- embedding_vector (pgvector)
- embedding_model
- created_at

#### 7.2.4.2 Book_Embeddings Table

- embedding_id (primary key)
- book_id (foreign key)
- embedding_vector (pgvector)
- embedding_model
- created_at

#### 7.2.5 Recommendation Search Filters Table

- recommendation_id (primary key)
- user_id (foreign key)
- filters (JSONB)
- timestamp
- model_used
- saved (boolean)

#### 7.2.6 Recommendation_Books Table

- rec_book_id (primary key)
- recommendation_id (foreign key)
- book_id (foreign key)
- similarity_score
- recommendation_reason[21][10][22]

### 7.3 API Endpoints

#### 7.3.1 Authentication Endpoints

- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/user

#### 7.3.2 Data Input Endpoints

- POST /api/upload/csv
- POST /api/preferences/manual

#### 7.3.3 Recommendation Endpoints

- POST /api/recommendations/generate
- GET /api/recommendations/history
- GET /api/recommendations/:id
- DELETE /api/recommendations/:id

#### 7.3.4 Payment Endpoints (later phase)

- POST /api/payments/create-checkout
- POST /api/payments/webhook
- GET /api/payments/history

#### 7.3.5 RAG Interface Endpoints

- POST /api/rag/query
- POST /api/rag/feedback[10][11][12]

## 8. MVP Scope

The Minimum Viable Product will include:

### 8.1 Core Functionality

- Goodreads CSV upload and parsing
- Manual preference specification
- Basic recommendation angles (general, genre-based, author-based)
- Recommendation generation and display
- Simple AI profile analysis
- Markdown export of recommendations[3][4][5][6]

### 8.2 User Authentication

- Sign-up and login functionality using Supabase Auth
- Protected dashboard for authenticated users
- Saving functionality for authenticated users[10][11][12]

### 8.3 Data Processing

- CSV parsing and validation
- Storage of structured data in Supabase PostgreSQL
- Basic error handling for data processing issues[5][6][21]

### 8.4 Embedding Generation

- Vector embedding creation using transformers.js
- Storage of embeddings in book_embeddings table using pgvector
- Similarity search functionality[23][21][22]

### 8.5 RAG Interface

- Simple chat interface for recommendation interaction
- Basic question answering about recommended books
- Integration with default open-source model (DeepSeek R1)[24][21][14]

## 9. Future Enhancements

### 9.1 Phase 2

- Advanced recommendation angles (character archetype, book-to-everything)
- Enhanced AI profile analysis with visualizations
- Integration with additional AI models
- Improved RAG interface with context awareness[3][4][9]

### 9.2 Phase 3

- Social features (sharing recommendations, following users)
- Book club functionality
- Integration with e-reader platforms
- Mobile application development
- API access for developers[3][4][9]

## 10. Success Metrics

### 10.1 User Engagement

- Number of active users
- Frequency of recommendation requests
- Time spent interacting with recommendations
- Return rate for repeat recommendations[1][2][9]

### 10.2 Recommendation Quality

- User satisfaction ratings
- Click-through rate on recommended books
- Conversion rate for book purchases
- Feedback on recommendation accuracy[3][4][9]

### 10.3 Technical Performance

- System response time
- Error rate for CSV processing
- Embedding generation speed
- API reliability and uptime[16][18][19]

## 11. Timeline and Milestones

### 11.1 Phase 1: MVP Development (8 weeks)

- Week 1-2: System architecture setup and database design
- Week 3-4: CSV parsing and data storage implementation
- Week 5-6: Vector embedding generation and recommendation engine
- Week 7-8: Front-end development and integration testing[1][2][25]

### 11.2 Phase 2: Beta Release (4 weeks)

- Week 1-2: User testing and feedback collection
- Week 3-4: Bug fixes and performance optimization[1][2][25]

### 11.3 Phase 3: Public Launch (2 weeks)

- Week 1: Final testing and preparation
- Week 2: Public launch and marketing[1][2][25]

## 12. Risks and Mitigations

### 12.1 Technical Risks

- Risk: Performance issues with vector embedding generation
  - Mitigation: Implement caching and batch processing
- Risk: Data privacy concerns with user reading history
  - Mitigation: Implement robust data encryption and privacy controls
- Risk: Integration challenges with multiple AI models
  - Mitigation: Create a unified API interface with fallback options[16][18][19]

## 13. Conclusion

BookMatch represents a significant advancement in personalized book recommendation systems. By leveraging the power of vector embeddings and flexible recommendation angles, it will provide readers with unprecedented accuracy and diversity in book discovery. The microservice architecture ensures scalability and extensibility, while the integration with multiple AI models offers flexibility in recommendation generation. With a focus on user experience and recommendation quality, BookMatch is positioned to become the preferred book recommendation platform for avid readers worldwide[1][2][3][4].

[1] https://www.altexsoft.com/blog/product-requirements-document/
[2] https://www.aha.io/roadmapping/guide/requirements-management/what-is-a-good-product-requirements-document-template
[3] https://cdn2.f-cdn.com/files/download/145238668/Book%20recommendation.pdf
[4] https://pritamaich.github.io/Books-Recommendation-System/
[5] https://www.reddit.com/r/TheStoryGraph/comments/15zoq1f/goodreads_data_import_question/
[6] https://booktrack.app/migrating-from-goodreads/
[7] https://www.youtube.com/watch?v=dpIt0sNTTsU
[8] https://datascientistinsights.substack.com/p/building-an-ai-powered-book-recommendation
[9] https://www.tinybird.co/blog-posts/real-time-recommendation-system
[10] https://supabase.com/docs/guides/auth/quickstarts/nextjs
[11] https://supabase.com/docs/guides/auth/server-side/nextjs
[12] https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
[13] https://github.com/ImranSefat/embedded-stripe-nextjs
[14] https://api-docs.deepseek.com/news/news250120
[15] https://www.datastax.com/blog/how-to-create-vector-embeddings-in-node-js
[16] https://blog.drinkbird.com/microservices-books-complete-collection/
[17] https://github.com/nilotpaul/next-books-app
[18] https://www.linkedin.com/posts/juliocasal_5-books-i-read-to-go-deep-into-microservices-activity-7099752189983682560-pNKL
[19] https://dev.to/tomjohnson3/the-art-of-creating-microservice-diagrams-3jl6
[20] https://www.heroui.com/docs/frameworks/nextjs
[21] https://www.reddit.com/r/Supabase/comments/1755wzh/extending_workshop_learnings_a_dive_into_supabase/
[22] https://lancedb.github.io/lancedb/examples/transformerjs_embedding_search_nodejs/
[23] https://gilberttanner.com/blog/building-a-book-recommendation-system-usingkeras/
[24] https://vercel.com/templates/next.js/weaviate-bookrecs
[25] https://www.atlassian.com/agile/product-management/requirements
[26] https://productschool.com/blog/product-strategy/product-template-requirements-document-prd
[27] https://formlabs.com/blog/product-requirements-document-prd-with-template/
[28] https://www.notion.com/blog/three-tips-product-requirement-document
[29] https://www.chatprd.ai/templates
[30] https://www.booksamillion.com/p/Mastering-Vector-Embeddings-Beginners/Edward-R-DeForest/9798321774588?id=9388226626948
[31] https://www.permit.io/blog/supabase-authentication-and-authorization-in-nextjs-implementation-guide
[32] https://www.notion.com/templates/collections/top-10-free-prd-product-requirements-doc-templates-in-notion
[33] https://www.multiplayer.app/distributed-systems-architecture/microservices-diagram/
[34] https://www.notion.com/templates/category/product-requirements-doc
[35] https://www.atlassian.com/software/confluence/templates/product-requirements
[36] https://www.reforge.com/artifacts/c/product-development/product-requirement-document-prd
[37] https://github.com/henry-azer/book-recommendation-system
[38] https://indjst.org/download-article.php?Article_Unique_Id=INDJST13447&Full_Text_Pdf_Download=True
[39] https://journals.mriindia.com/index.php/ijacte/article/download/212/249/435
[40] https://help.goodreads.com/s/article/How-do-I-import-or-export-my-books-1553870934590
[41] https://help.goodreads.com/s/question/0D51H00005VxoY3SAJ/what-date-format-is-used-for-importing-csv-file
[42] https://gist.github.com/tmcw/f077b2f174a0194f62b94bec4e88f4d0
[43] https://supabase.com/docs/guides/auth/auth-helpers/nextjs
[44] https://www.youtube.com/watch?v=yDJcdDa6la0
