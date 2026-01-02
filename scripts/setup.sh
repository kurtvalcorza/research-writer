#!/bin/bash

# Research Writer - Setup and Validation Script
# This script creates required directories and validates the environment

set -e  # Exit on error

echo "🔧 Setting up research-writer environment..."
echo ""

# Create required directories
echo "📁 Creating required directories..."
mkdir -p corpus outputs
echo "   ✅ corpus/ directory ready"
echo "   ✅ outputs/ directory ready"
echo ""

# Check Python
echo "🐍 Checking Python installation..."
if ! command -v python3 &> /dev/null; then
  echo "   ❌ Python 3 not found"
  echo "   Please install Python 3.8 or higher"
  exit 1
fi
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
echo "   ✅ Python $PYTHON_VERSION found"
echo ""

# Check/Install PDF libraries
echo "📚 Checking PDF processing libraries..."
MISSING_LIBS=0

if ! python3 -c "import pypdf" 2>/dev/null; then
  echo "   ⚠️  pypdf library not installed"
  MISSING_LIBS=1
fi

if ! python3 -c "import PyPDF2" 2>/dev/null; then
  echo "   ⚠️  PyPDF2 library not installed"
  MISSING_LIBS=1
fi

if [ $MISSING_LIBS -eq 1 ]; then
  echo ""
  echo "   Installing PDF processing libraries..."
  pip install -r requirements.txt
  echo "   ✅ PDF libraries installed"
else
  echo "   ✅ PDF libraries already installed"
fi
echo ""

# Check template customization
echo "📋 Checking screening criteria template..."
if grep -q "AI adoption in the Philippines" template/screening-criteria-template.md 2>/dev/null; then
  echo "   ⚠️  WARNING: Template contains example content"
  echo "   Please customize template/screening-criteria-template.md for your research topic"
  echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Customize template/screening-criteria-template.md for your research topic"
echo "  2. Add PDF files to corpus/ directory"
echo "  3. Run Phase 1 screening (see README.md)"
echo ""
