# Create fresh RN project (this generates iOS/Android folders)
npx @react-native-community/cli@latest init MyInterviewApp

# Copy your source files into it
cp -r ~/Downloads/RNInterviewPrep/src MyInterviewApp/
cp ~/Downloads/RNInterviewPrep/App.tsx MyInterviewApp/

# Add dependencies and run
cd MyInterviewApp
npm install
cd ios && pod install && cd ..
npm run ios