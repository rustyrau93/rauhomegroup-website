#!/usr/bin/env python3
"""
Fix all neighborhood pages to include proper header and footer from main site.
"""

import os
import re
from pathlib import Path

# Define paths
REPO_DIR = Path("/Users/ariabot/.openclaw/workspace/rau-website-gemini")
INDEX_FILE = REPO_DIR / "index.html"
NEIGHBORHOODS_DIR = REPO_DIR / "neighborhoods"

# Read index.html to extract header and footer
print("Reading index.html...")
with open(INDEX_FILE, 'r', encoding='utf-8') as f:
    index_content = f.read()

# Extract header (everything before <main id="main-content">)
header_match = re.search(r'^(.*?)<main id="main-content">', index_content, re.DOTALL)
if not header_match:
    raise Exception("Could not find header in index.html")
header = header_match.group(1)

# Extract footer (from <footer to end)
footer_match = re.search(r'(    <!-- Footer -->.*)', index_content, re.DOTALL)
if not footer_match:
    raise Exception("Could not find footer in index.html")
footer = footer_match.group(1)

# Adjust header for neighborhood pages
# Fix CSS path
header = header.replace('href="styles.css"', 'href="../styles.css"')
header = header.replace('href="luxury-effects.css"', 'href="../luxury-effects.css"')
# Fix logo path
header = header.replace('src="images/logo.png"', 'src="../images/logo.png"')
header = header.replace('src="images/logo-white.jpg"', 'src="../images/logo-white.jpg"')
# Fix navigation links
header = header.replace('href="/', 'href="../')
header = header.replace('href="#about"', 'href="../index.html#about"')
header = header.replace('href="#"', 'href="../index.html"')

# Adjust footer for neighborhood pages
footer = footer.replace('href="#about"', 'href="../index.html#about"')
footer = footer.replace('href="#testimonials"', 'href="../index.html#testimonials"')
footer = footer.replace('href="/buyers.html"', 'href="../buyers.html"')
footer = footer.replace('href="/sellers.html"', 'href="../sellers.html"')
footer = footer.replace('href="/neighborhoods.html"', 'href="../neighborhoods.html"')
footer = footer.replace('href="/contact.html"', 'href="../contact.html"')
footer = footer.replace('href="/blog.html"', 'href="../blog.html"')
footer = footer.replace('href="/mortgage-calculator.html"', 'href="../mortgage-calculator.html"')
footer = footer.replace('src="https://unpkg.com', 'defer src="https://unpkg.com')
footer = footer.replace('src="script.js"', 'src="../script.js"')
footer = footer.replace('src="luxury-effects.js"', 'src="../luxury-effects.js"')

# Process all neighborhood HTML files
neighborhood_files = sorted(NEIGHBORHOODS_DIR.glob("*.html"))
print(f"\nFound {len(neighborhood_files)} neighborhood files")

for filepath in neighborhood_files:
    print(f"Processing {filepath.name}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the neighborhood-specific content
    # Find the hero section start (with or without comment)
    hero_match = re.search(r'(    <!-- Hero Section -->.*)', content, re.DOTALL)
    if not hero_match:
        # Try without comment - just look for body content after </head>
        body_match = re.search(r'</head>\s*<body>(.*)', content, re.DOTALL)
        if body_match:
            neighborhood_content = body_match.group(1)
            # Clean up any existing closing tags
            neighborhood_content = re.sub(r'</body>.*', '', neighborhood_content, flags=re.DOTALL)
            neighborhood_content = re.sub(r'</html>.*', '', neighborhood_content, flags=re.DOTALL)
            neighborhood_content = neighborhood_content.strip()
        else:
            print(f"  WARNING: Could not find content in {filepath.name}, skipping...")
            continue
    else:
        neighborhood_content = hero_match.group(1)
    
    # Remove any existing footer and closing tags from neighborhood content
    neighborhood_content = re.sub(r'</body>.*', '', neighborhood_content, flags=re.DOTALL)
    neighborhood_content = re.sub(r'</html>.*', '', neighborhood_content, flags=re.DOTALL)
    
    # Extract head section to preserve meta tags and inline styles
    head_match = re.search(r'<head>(.*?)</head>', content, re.DOTALL)
    if not head_match:
        print(f"  WARNING: Could not find head section in {filepath.name}, skipping...")
        continue
    
    old_head = head_match.group(1)
    
    # Extract meta tags and styles from old head
    title_match = re.search(r'<title>(.*?)</title>', old_head, re.DOTALL)
    title = title_match.group(0) if title_match else '<title>Neighborhood | Rau Home Group</title>'
    
    description_match = re.search(r'<meta name="description".*?>', old_head, re.DOTALL)
    description = description_match.group(0) if description_match else ''
    
    style_match = re.search(r'<style>(.*?)</style>', old_head, re.DOTALL)
    inline_styles = style_match.group(0) if style_match else ''
    
    schema_match = re.search(r'<script type="application/ld\+json">.*?</script>', content, re.DOTALL)
    schema = schema_match.group(0) if schema_match else ''
    
    # Build new head from header template
    new_head_match = re.search(r'<head>(.*?)</head>', header, re.DOTALL)
    new_head_template = new_head_match.group(1)
    
    # Replace title and add description
    new_head = re.sub(r'<title>.*?</title>', title, new_head_template)
    new_head = re.sub(r'(<meta name="robots".*?>)', f'{description}\n    \\1' if description else '\\1', new_head)
    
    # Add inline styles before closing head
    if inline_styles:
        new_head += '\n    ' + inline_styles
    
    # Construct complete page
    new_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
{new_head}
</head>
<body>
    <!-- Skip to main content link for accessibility -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <!-- Navigation -->
    <nav class="navbar" role="navigation" aria-label="Main navigation">
        <div class="nav-container">
            <a href="../index.html" class="logo" aria-label="Rau Home Group - Home">
                <img src="../images/logo-white.jpg" alt="" class="logo-img" width="60" height="60" aria-hidden="true">
                <div class="logo-text-wrap">
                    <span class="logo-text">RAU HOME GROUP</span>
                    <span class="logo-subtitle">SAN DIEGO REAL ESTATE</span>
                </div>
            </a>
            <ul class="nav-links" role="menubar">
                <li role="none"><a href="../index.html#about" role="menuitem">About</a></li>
                <li role="none"><a href="../buyers.html" role="menuitem">Buyers</a></li>
                <li role="none"><a href="../sellers.html" role="menuitem">Sellers</a></li>
                <li class="nav-dropdown" role="none">
                    <a href="../index.html" class="dropdown-toggle" role="menuitem" aria-haspopup="true" aria-expanded="false">
                        Resources <i class="fas fa-chevron-down" aria-hidden="true"></i>
                    </a>
                    <ul class="dropdown-menu" role="menu" aria-label="Resources submenu">
                        <li role="none"><a href="../mortgage-calculator.html" role="menuitem"><i class="fas fa-calculator" aria-hidden="true"></i> Mortgage Calculator</a></li>
                        <li role="none"><a href="../neighborhoods.html" role="menuitem"><i class="fas fa-map-marked-alt" aria-hidden="true"></i> San Diego Neighborhoods</a></li>
                    </ul>
                </li>
                <li role="none"><a href="../contact.html" class="nav-cta" role="menuitem">Contact</a></li>
            </ul>
            <button class="mobile-menu-btn" aria-label="Toggle mobile menu" aria-expanded="false" aria-controls="nav-links">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>

{neighborhood_content}

    <!-- Footer -->
    <footer class="footer" role="contentinfo">
        <div class="container">
            <!-- Accolades/Trust Badges -->
            <div class="footer-accolades" role="list" aria-label="Achievements and certifications">
                <div class="accolade-item" role="listitem">
                    <i class="fas fa-award" aria-hidden="true"></i>
                    <span>Top Producer</span>
                </div>
                <div class="accolade-item" role="listitem">
                    <i class="fas fa-star" aria-hidden="true"></i>
                    <span>100% 5-Star Reviews</span>
                </div>
                <div class="accolade-item" role="listitem">
                    <i class="fas fa-shield-alt" aria-hidden="true"></i>
                    <span>Licensed REALTOR</span>
                </div>
                <div class="accolade-item" role="listitem">
                    <i class="fas fa-trophy" aria-hidden="true"></i>
                    <span>Top 5% in San Diego</span>
                </div>
            </div>
            
            <div class="footer-content">
                <div class="footer-brand">
                    <span class="logo-text">RAU HOME GROUP</span>
                    <p>San Diego Real Estate Expert</p>
                    <p class="footer-brokerage">Rau Home Group</p>
                    <!-- Social Icons -->
                    <div class="footer-social" role="list" aria-label="Social media links">
                        <a href="https://www.instagram.com/rustyrau_sdrealtor/" target="_blank" rel="noopener noreferrer" aria-label="Follow Rusty on Instagram">
                            <i class="fab fa-instagram" aria-hidden="true"></i>
                        </a>
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Follow Rusty on Facebook">
                            <i class="fab fa-facebook-f" aria-hidden="true"></i>
                        </a>
                        <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="Connect with Rusty on LinkedIn">
                            <i class="fab fa-linkedin-in" aria-hidden="true"></i>
                        </a>
                        <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="Watch Rusty on YouTube">
                            <i class="fab fa-youtube" aria-hidden="true"></i>
                        </a>
                    </div>
                </div>
                <nav class="footer-nav" aria-label="Footer navigation">
                    <div class="footer-links">
                        <a href="../index.html#about">About</a>
                        <a href="../buyers.html">Buyers</a>
                        <a href="../sellers.html">Sellers</a>
                        <a href="../neighborhoods.html">Areas</a>
                        <a href="../contact.html">Contact</a>
                    </div>
                    <div class="footer-links footer-links-secondary">
                        <a href="../blog.html">Blog</a>
                        <a href="../index.html#testimonials">Reviews</a>
                        <a href="../mortgage-calculator.html">Mortgage Calculator</a>
                        <a href="../neighborhoods.html">San Diego Neighborhoods</a>
                    </div>
                </nav>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Rusty Rau. All rights reserved.</p>
                <p class="footer-legal">DRE# 02084462 | Rau Home Group</p>
            </div>
        </div>
    </footer>

    <!-- Scripts - Deferred for better performance -->
    <script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
    <script src="../script.js" defer></script>
    <script src="../luxury-effects.js" defer></script>

{schema}
</body>
</html>"""
    
    # Write the updated content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"  ✓ Updated {filepath.name}")

print(f"\n✓ Successfully processed all {len(neighborhood_files)} neighborhood pages!")
