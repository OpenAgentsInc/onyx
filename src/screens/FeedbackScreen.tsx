'use dom';

import * as React from "react"
import Button from "@/components/Button"
import Card from "@/components/Card"
import TextArea from "@/components/TextArea"
import { View } from "react-native"

export default function FeedbackScreen() {
  const styles = {
    container: {
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      minHeight: '100vh',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
    },
    text: {
      fontSize: '14px',
      lineHeight: '1.5',
    },
    textAreaContainer: {
      marginTop: '20px',
    },
    sectionTitle: {
      fontFamily: 'jetBrainsMonoBold, monospace',
      fontSize: '16px',
      margin: '12px 0',
    },
    buttonContainer: {
      marginTop: '20px',
      display: 'flex',
      gap: '10px',
    },
  };

  const [feedback, setFeedback] = React.useState('');

  return (
    <View style={styles.container}>
      <Card title="We Value Your Feedback">
        <p style={styles.text}>
          Please share your thoughts on Onyx—what works, what could be improved, and any features you'd like to see.
        </p>
      </Card>

      <div style={styles.textAreaContainer}>
        <TextArea
          placeholder="Enter your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          style={{
            minHeight: '150px',
            boxShadow: 'inset 0 0 0 1px #fff',
            padding: '12px',
            color: '#fff',
            fontFamily: 'jetBrainsMonoRegular, monospace',
            fontSize: '14px',
          }}
        />
      </div>

      <div style={styles.buttonContainer}>
        <Button
          theme="PRIMARY"
          onClick={() => {
            console.log('Submitting feedback:', feedback);
            setFeedback('');
          }}
        >
          Submit
        </Button>
        <Button theme="SECONDARY" onClick={() => setFeedback('')}>
          Clear
        </Button>
      </div>
    </View>
  );
}