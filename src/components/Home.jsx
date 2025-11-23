import React, { useState } from 'react';

// Replacing image imports with inline SVG components for stability and portability.

// Inline SVG for Google Logo
const GoogleIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 48 48" 
    className="h-6 w-6"
  >
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.765-6.08 7.973-11.303 7.973-6.762 0-12.261-5.499-12.261-12.261s5.499-12.261 12.261-12.261c3.167 0 5.929 1.298 8.031 3.395l5.657-5.657C34.046 6.096 29.049 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20v-2.083z"></path>
    <path fill="#FF3D00" d="M6.306 14.693l5.657 4.792A12.263 12.263 0 0111.739 12.261c0-3.167 1.298-5.929 3.395-8.031L11.739 4C6.08 6.096 4 12.955 4 24s1.725 15.604 7.739 20z"></path>
    <path fill="#4CAF50" d="M24 44c5.223 0 9.654-3.208 11.303-7.973l-5.657-4.792c-1.649 4.765-6.08 7.973-11.303 7.973-6.762 0-12.261-5.499-12.261-12.261s5.499-12.261 12.261-12.261c3.167 0 5.929 1.298 8.031 3.395l5.657-5.657C34.046 6.096 29.049 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20v0z"></path>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.765-6.08 7.973-11.303 7.973-6.762 0-12.261-5.499-12.261-12.261s5.499-12.261 12.261-12.261c3.167 0 5.929 1.298 8.031 3.395l5.657-5.657C34.046 6.096 29.049 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20z"></path>
  </svg>
);

// Inline SVG for GitHub Logo
const GithubIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className || "h-6 w-6"}
  >
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.864 8.169 6.837 9.48.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.341-3.369-1.341-.454-1.156-1.11-1.46-1.11-1.46-.907-.619.069-.607.069-.607 1.004.07 1.532 1.03 1.532 1.03.892 1.531 2.341 1.088 2.91.83.092-.644.35-1.088.674-1.336-2.227-.253-4.555-1.114-4.555-4.945 0-1.091.39-1.984 1.03-2.682-.104-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844a9.564 9.564 0 014.852 1.354c1.91-1.302 2.75-1.026 2.75-1.026.544 1.378.202 2.397.098 2.65.64.698 1.03 1.591 1.03 2.682 0 3.84-2.332 4.685-4.565 4.935.359.309.678.92.678 1.855 0 1.336-.013 2.415-.013 2.75 0 .267.18.582.687.485C20.887 20.187 24 16.437 24 12 24 6.477 19.523 2 14 2h-2z" clipRule="evenodd" />
  </svg>
);


const Home = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [provider, setProvider] = useState(null);

  const startLogin = (loginFunction, providerName) => {
    setIsAuthenticating(true);
    setProvider(providerName);

    setTimeout(() => {
      loginFunction();
    }, 500); 
  };

  const googleLogin = () => {
    window.location.href = `http:${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_AUTHORIZATION_GOOGLE}`;
  };

  const githubLogin = () => {
    window.location.href = `http:${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_AUTHORIZATION_GITHUB}`;
  };

  // --- Reusable Button Content/Spinner ---
  const ButtonContent = ({ text, isCurrent, iconComponent: Icon }) => (
    isAuthenticating && isCurrent ? (
      // Display the spinner and a message when authenticating
      <div className="flex items-center space-x-3">
          <svg className="animate-spin h-5 w-5 text-gray-700" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className='font-bold'>Redirecting...</span>
      </div>
    ) : (
      // Display the normal button content
      <>
        {/* Render the passed Icon component */}
        <Icon className={text.includes('GitHub') ? 'h-6 w-6 text-gray-800' : ''} /> 
        <span>{text}</span>
      </>
    )
  );

  return (
    <div className="font-poppins h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-8 w-full max-w-sm p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
        
        {/* Title and Logo Placeholder */}
        <div className='flex flex-col items-center gap-2'>
            <span className="text-4xl">🔑</span>
            <h1 className="font-extrabold text-3xl text-gray-800 tracking-tight">
                Secure Sign-In
            </h1>
            <p className='text-sm text-gray-500'>Use your preferred provider to continue.</p>
        </div>

        {/* Button Container */}
        <div className="flex flex-col items-center w-full gap-4">
          
          {/* Google Button */}
          <button
            onClick={() => startLogin(googleLogin, 'Google')}
            disabled={isAuthenticating}
            className={`flex items-center justify-center w-full px-6 py-3 rounded-lg font-semibold text-lg transition duration-200 shadow-md border 
                        ${isAuthenticating && provider === 'Google'
                            ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-lg focus:ring-4 focus:ring-blue-100'
                        }`}
          >
            <ButtonContent 
                text="Login with Google" 
                isCurrent={provider === 'Google'} 
                iconComponent={GoogleIcon} // Pass the SVG component
            />
          </button>

          {/* GitHub Button */}
          <button
            onClick={() => startLogin(githubLogin, 'Github')}
            disabled={isAuthenticating}
            className={`flex items-center justify-center w-full px-6 py-3 rounded-lg font-semibold text-lg transition duration-200 border 
                        ${isAuthenticating && provider === 'Github'
                            ? 'bg-gray-700 text-white cursor-not-allowed'
                            : 'bg-gray-800 text-white shadow-md border-gray-800 hover:bg-gray-900 hover:shadow-xl focus:ring-4 focus:ring-gray-300'
                        }`}
          >
            <ButtonContent 
                text="Login with GitHub" 
                isCurrent={provider === 'Github'} 
                iconComponent={() => <GithubIcon className="h-6 w-6 text-white" />} // Pass the SVG component with white color
            />
          </button>
        </div>
        
        {/* Footer/Context */}
        <p className='text-xs text-gray-400'>
            By signing in, you agree to our <a href="#" className='underline hover:text-gray-600'>Terms of Service</a>.
        </p>

      </div>
    </div>
  );
};

export default Home;