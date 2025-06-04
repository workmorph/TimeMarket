#!/bin/bash

echo "🚀 Setting up development environment for TimeMarket..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install Node.js and npm first.${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}🔧 Setting up Husky Git hooks...${NC}"
npx husky init
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg

echo -e "${YELLOW}🎨 Running initial format check...${NC}"
npm run format

echo -e "${YELLOW}🔍 Running initial lint check...${NC}"
npm run lint:fix

echo -e "${YELLOW}📝 Running type check...${NC}"
npm run type-check

echo -e "${GREEN}✅ Development environment setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. If using VS Code, install recommended extensions"
echo "2. Review docs/DEVELOPMENT_SETUP.md for detailed information"
echo "3. Run 'npm run dev' to start development"
echo ""
echo "Available commands:"
echo "  npm run dev        - Start development server"
echo "  npm run lint       - Run ESLint"
echo "  npm run lint:fix   - Auto-fix ESLint issues"
echo "  npm run format     - Format code with Prettier"
echo "  npm run type-check - Check TypeScript types"