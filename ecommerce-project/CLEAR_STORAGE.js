// Clear Corrupted LocalStorage Script
// Run this in browser console (F12) to fix JSON errors

console.log('Clearing localStorage...');
localStorage.clear();
sessionStorage.clear();
console.log('✓ LocalStorage cleared');
console.log('Refreshing page...');
window.location.reload();
