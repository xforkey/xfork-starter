#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Define paths
const demoDir = path.join(process.cwd(), 'src', 'demo');
const outputFile = path.join(process.cwd(), 'src', 'demo', 'registry.ts');

// Function to capitalize first letter of each word
function capitalizeFirstLetter(string: string): string {
    return string
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

async function buildRegistry() {
    try {
        // Read all files in the demo directory
        const files = fs.readdirSync(demoDir);

        // Filter for *-demo.tsx files
        const demoFiles = files.filter(file => file.endsWith('-demo.tsx'));

        // Process each file to extract component name
        const components = demoFiles.map(file => {
            // Remove -demo.tsx and capitalize first letter
            const componentName = file.replace('-demo.tsx', '');
            return {
                name: componentName,
                displayName: capitalizeFirstLetter(componentName),
                demo: file
            };
        });

        // Sort components alphabetically
        components.sort((a, b) => a.name.localeCompare(b.name));

        // Generate registry content
        const registryContent = `// This file is auto-generated by scripts/build-registry.mts
// Do not edit this file directly

export interface ComponentInfo {
  name: string;
  displayName: string;
  demo: string;
}

export const registry: Record<string, ComponentInfo> = {
${components.map(comp => `  "${comp.name}": {
    name: "${comp.name}",
    displayName: "${comp.displayName}",
    demo: "${comp.demo}"
  }`).join(',\n')}
};
`;

        // Write to output file
        fs.writeFileSync(outputFile, registryContent);

        console.log(`Registry built successfully with ${components.length} components`);
        console.log(`Output written to ${outputFile}`);

    } catch (error) {
        console.error('Error building registry:', error);
        process.exit(1);
    }
}

// Execute the function
buildRegistry();