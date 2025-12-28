import { Student } from '../types';

const API_TIMEOUT_MS = 0; // 5 seconds
// IMPORTANT: Replace this with your actual API endpoint
const API_URL = 'https://your-api-endpoint.com/students'; 

class StudentService {
  /**
   * Fetches student data, trying the API first and falling back to static files on timeout or error.
   * @returns {Promise<{ data: Student[], source: 'api' | 'files' }>}
   */
  async getStudents(): Promise<{ data: Student[], source: 'api' | 'files' }> {
    try {
      console.log('Attempting to fetch data from API...');
      const data = await this.fetchFromApiWithTimeout();
      console.log('Successfully fetched data from API.');
      return { data, source: 'api' };
    } catch (error) {
      console.warn(`API failed or timed out (${API_TIMEOUT_MS}ms). Falling back to static files.`, error);
      const data = await this.fetchFromStaticFiles();
      console.log('Successfully loaded data from static files.');
      return { data, source: 'files' };
    }
  }

  /**
   * Tries to fetch data from the API with a timeout.
   * @private
   */
  private async fetchFromApiWithTimeout(): Promise<Student[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
      const response = await fetch(API_URL, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId); // Clear the timeout if fetch succeeds in time

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      return response.json();
    } catch (err) {
      clearTimeout(timeoutId); // Ensure timeout is cleared on error too
      throw err; // Re-throw the error to be caught by the main getStudents method
    }
  }

  /**
   * Loads all student data from the local static JSON files.
   * @private
   */
  private async fetchFromStaticFiles(): Promise<Student[]> {
    // Dynamically import the aggregated data from the index file
    const studentDataModule = await import('../data/students');
    return studentDataModule.default;
  }
}

// Export a singleton instance of the service
export default new StudentService();