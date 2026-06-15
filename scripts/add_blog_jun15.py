import os
import sys
import psycopg2
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

def main():
    # Database connection
    try:
        conn = psycopg2.connect(os.getenv("DATABASE_PUBLIC_URL"))
        cur = conn.cursor()
    except Exception as e:
        print(f"Database connection failed: {e}")
        return

    try:
        # Blog post content
        slug = "ai-image-generator-blog-featured-images"
        title = "How to Create Blog Featured Images in 30 Seconds with AI"
        description = "Stop paying for stock photos. Create unique featured images for your blog posts in 30 seconds with AI. Custom aspect ratios, styles, and quality levels."
        content = """
<p>I used to spend 10 minutes searching for a stock photo for every blog post. Most were either too expensive, didn't match the content, or had a generic look. Then I started using an <a href="/en/tools/ai-image-generator">AI image generator</a> — now I create unique featured images in 30 seconds.</p>

<h2>What Makes a Good Featured Image</h2>

<p>A featured image should be:
<ul>
  <li>Relevant to your post's content</li>
  <li>Visually appealing</li>
  <li>High-quality (at least 1200x630 pixels)</li>
  <li>Unique — not a stock photo everyone else uses</li>
</ul>

An <a href="/en/tools/ai-image-generator">AI image generator</a> checks all these boxes. You describe what you want, and it creates an image from scratch.</p>

<h2>The 30-Second Workflow</h2>

<p>Here's how I create every featured image:</p>

<h3>1. Choose the Right Aspect Ratio</h3>

<p>Blog posts need a 1200x630 (16:9) aspect ratio. Our <a href="/en/tools/ai-image-generator">AI image generator</a> supports four aspect ratios: square (1:1), landscape (16:9), portrait (9:16), and wide (21:9). For featured images, I always pick 16:9.</p>

<h3>2. Write a Specific Prompt</h3>

<p>The more specific your prompt, the better the result. Instead of "a cat," try "a golden retriever puppy sitting on a wooden dock at sunset, photorealistic, warm lighting, shallow depth of field."</p>

<p>I use a template: [Subject] + [Location] + [Style] + [Details]. This gives the AI all the information it needs to create a relevant image.</p>

<h3>3. Generate and Download</h3>

<p>Click "Generate Image" and wait 30 seconds. The AI uses SDXL to create a high-quality image. Download the PNG file and upload it to your blog.</p>

<h2>The Style That Gets Clicks</h2>

<p>I experimented with different styles and found that <strong>photorealistic</strong> images get the most clicks. They look like real photos, not AI-generated art. For tutorials, I use "cinematic lighting" or "3D render" styles for a professional look.</p>

<h2>Why AI Beats Stock Photos</h2>

<p><strong>Cost.</strong> Stock photos cost $5-20 per image. AI-generated images cost 2-7 credits, which is about $0.60-2.10 per image.</p>

<p><strong>Uniqueness.</strong> No one else has your AI-generated image. Stock photos are used by thousands of websites.</p>

<p><strong>Relevance.</strong> You can describe exactly what you need. Stock photos are often a compromise.</p>

<h2>Try It Yourself</h2>

<p>Ready to create your own featured images? <a href="/en/signup">Sign up for a free account</a> and get 5 credits to try the <a href="/en/tools/ai-image-generator">AI image generator</a>. No credit card required. Create your first featured image in 30 seconds.</p>
"""
        category = "Image Generation"
        tags = "AI image generator, featured images, blog images, stock photo alternative, AI art"
        related_tools = "ai-image-generator"
        published = True
        created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        updated_at = created_at

        # Insert into database
        cur.execute(
            """
            INSERT INTO blog_posts (slug, title, description, content, category, tags, related_tools, published, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (slug, title, description, content, category, tags, related_tools, published, created_at, updated_at)
        )
        conn.commit()
        print("Blog post added successfully")

    except Exception as e:
        conn.rollback()
        print(f"Error adding blog post: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    main()
