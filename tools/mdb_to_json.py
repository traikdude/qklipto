#!/usr/bin/env python3
"""
MDB to Clipto JSON Converter

Converts legacy Access .mdb files to JSON format compatible with Clipto Android import.
Requires: pip install pandas-access (or pypyodbc on Windows with Access drivers)

Alternative: Uses mdbtools on Linux/Mac: pip install mdb-tools

Usage:
    python mdb_to_json.py recovery/android_data.mdb backups/android_data.json
"""

import sys
import json
import subprocess
from datetime import datetime
from pathlib import Path

def convert_mdb_to_json(input_path: str, output_path: str):
    """Convert MDB file to Clipto-compatible JSON format."""
    
    # Try using mdb-export command (mdbtools)
    try:
        # First, get the list of tables
        result = subprocess.run(
            ['mdb-tables', '-1', input_path],
            capture_output=True, text=True, check=True
        )
        tables = [t.strip() for t in result.stdout.strip().split('\n') if t.strip()]
        
        notes = []
        
        for table in tables:
            # Export table to JSON-like format
            result = subprocess.run(
                ['mdb-export', '-H', input_path, table],
                capture_output=True, text=True, check=True
            )
            
            # Parse CSV output
            import csv
            from io import StringIO
            
            reader = csv.DictReader(StringIO(result.stdout))
            for row in reader:
                note = {
                    "created": row.get("created", datetime.now().isoformat()),
                    "updated": row.get("updated", datetime.now().isoformat()),
                    "modified": row.get("modified", datetime.now().isoformat()),
                    "type": "0",  # TEXT type
                    "fav": row.get("fav", "false").lower() == "true",
                    "text": row.get("text", ""),
                    "title": row.get("title", ""),
                    "used": int(row.get("used", 0)),
                    "tracked": row.get("tracked", "false").lower() == "true",
                    "tags": [t.strip() for t in row.get("tags", "").split(",") if t.strip()]
                }
                notes.append(note)
        
        # Create final JSON structure
        output = {
            "created": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
            "notes": notes,
            "filters": []
        }
        
        # Write output
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Converted {len(notes)} notes to {output_path}")
        return True
        
    except FileNotFoundError:
        print("❌ mdbtools not found. Install with:")
        print("   Linux: sudo apt install mdbtools")
        print("   Mac: brew install mdbtools")
        print("   Windows: Use Access Database Engine or alternative method")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    if len(sys.argv) != 3:
        print("Usage: python mdb_to_json.py <input.mdb> <output.json>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    
    if not Path(input_path).exists():
        print(f"❌ Input file not found: {input_path}")
        sys.exit(1)
    
    success = convert_mdb_to_json(input_path, output_path)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
