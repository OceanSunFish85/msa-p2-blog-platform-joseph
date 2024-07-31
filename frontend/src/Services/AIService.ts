import axios from 'axios';
import { SummarizedRequest, SummarizedResponse } from '../Models/Article';
import API_URL from '../Constants';

export const generateSummary = async (
  Inputs: SummarizedRequest
): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}aisummary/summarize`, Inputs);
    return response.data;
  } catch (error) {
    console.error('Failed to generate summary:', error);
    throw error;
  }
};
