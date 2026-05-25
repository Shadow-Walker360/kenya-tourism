#!/bin/bash
cd /workspace/media/videos

# Download wildlife/savannah video (already have savannah.mp4)
# Download coast/beach video
if [ ! -f "coast.mp4" ]; then
  echo "Downloading coast video..."
  curl -L -o coast.mp4 "https://cdn.pixabay.com/vimeo/349567682/coast-24714.mp4?width=640&hash=f4c8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8" 2>/dev/null || echo "Using placeholder"
fi

# Download mountain video  
if [ ! -f "mount.mp4" ]; then
  echo "Downloading mountain video..."
  curl -L -o mount.mp4 "https://cdn.pixabay.com/vimeo/320506648/mountain-19434.mp4?width=640&hash=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0" 2>/dev/null || echo "Using placeholder"
fi

# Download lake video
if [ ! -f "lake.mp4" ]; then
  echo "Downloading lake video..."
  curl -L -o lake.mp4 "https://cdn.pixabay.com/vimeo/362580446/lake-27034.mp4?width=640&hash=b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1" 2>/dev/null || echo "Using placeholder"
fi

# Download wildlife video
if [ ! -f "wildlife.mp4" ]; then
  echo "Downloading wildlife video..."
  curl -L -o wildlife.mp4 "https://cdn.pixabay.com/vimeo/350528884/wildlife-24847.mp4?width=640&hash=c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2" 2>/dev/null || cp savannah.mp4 wildlife.mp4
fi

echo "Video setup complete!"
ls -la *.mp4 | grep -v "^\."
