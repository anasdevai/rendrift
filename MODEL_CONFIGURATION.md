# AI Model Configuration Guide

## Current Models

The FocusCast AI pipeline uses two AI agents:

1. **Analyst Agent** - Analyzes video frames to detect UI events
   - Default: `google/gemini-flash-1.5`
   - Cost: ~$0.0005 per job
   - Supports: Vision (image analysis)

2. **Director Agent** - Generates cinematic render scripts
   - Default: `meta-llama/llama-3.1-8b-instruct:free`
   - Cost: Free
   - Supports: Text generation

## Changing Models

You can configure which models to use via environment variables in `apps/processor/.env`:

```env
# Analyst Agent (must support vision/images)
ANALYST_MODEL=google/gemini-flash-1.5

# Director Agent (text generation only)
DIRECTOR_MODEL=meta-llama/llama-3.1-8b-instruct:free
```

## Using OpenRouter Auto-Routing

OpenRouter's `openrouter/auto` automatically selects the best available model based on:
- Your budget preferences
- Model availability
- Task requirements

To enable auto-routing:

```env
# Use auto-routing for both agents
ANALYST_MODEL=openrouter/auto
DIRECTOR_MODEL=openrouter/auto
```

**Note**: Auto-routing may select more expensive models. Monitor your OpenRouter usage!

## Recommended Models

### For Analyst Agent (Vision Required)

**Free/Cheap Options:**
```env
ANALYST_MODEL=google/gemini-flash-1.5          # ~$0.0005/job (recommended)
ANALYST_MODEL=google/gemini-flash-1.5-8b       # Even cheaper
```

**Premium Options (if you have budget):**
```env
ANALYST_MODEL=openai/gpt-4o                    # Best quality, expensive
ANALYST_MODEL=anthropic/claude-3-5-sonnet      # Great quality, expensive
ANALYST_MODEL=google/gemini-pro-1.5            # Good balance
```

### For Director Agent (Text Only)

**Free Options:**
```env
DIRECTOR_MODEL=meta-llama/llama-3.1-8b-instruct:free    # Free (recommended)
DIRECTOR_MODEL=meta-llama/llama-3.1-70b-instruct:free   # Free, better quality
DIRECTOR_MODEL=google/gemma-2-9b-it:free                # Free alternative
```

**Paid Options (better quality):**
```env
DIRECTOR_MODEL=meta-llama/llama-3.1-8b-instruct         # ~$0.0001/job
DIRECTOR_MODEL=anthropic/claude-3-haiku                 # Fast and cheap
DIRECTOR_MODEL=openai/gpt-4o-mini                       # Good balance
```

## Cost Optimization

### Ultra-Budget (Free Tier)
```env
ANALYST_MODEL=google/gemini-flash-1.5-8b
DIRECTOR_MODEL=meta-llama/llama-3.1-8b-instruct:free
```
**Cost per job**: ~$0.0003

### Recommended (Best Value)
```env
ANALYST_MODEL=google/gemini-flash-1.5
DIRECTOR_MODEL=meta-llama/llama-3.1-8b-instruct:free
```
**Cost per job**: ~$0.0005

### Premium (Best Quality)
```env
ANALYST_MODEL=openai/gpt-4o
DIRECTOR_MODEL=anthropic/claude-3-5-sonnet
```
**Cost per job**: ~$0.05-0.10

## Testing Different Models

1. **Update .env file** with new model names
2. **Restart Python agent**:
   ```bash
   # Stop the agent (Ctrl+C)
   cd apps/processor/agent
   uv run uvicorn main:app --host 0.0.0.0 --port 8000
   ```
3. **Upload a test video** and compare results

## Model Requirements

### Analyst Agent Requirements:
- ✅ Must support vision/image inputs
- ✅ Must handle multiple images in one request
- ✅ Should be fast (processes 10-30 frames)
- ✅ Should be cheap (runs on every job)

### Director Agent Requirements:
- ✅ Must support JSON output
- ✅ Should understand cinematography concepts
- ✅ Should be creative but consistent
- ✅ Can be slower (only runs once per job)

## Troubleshooting

### "Model not found" Error
- Check model name spelling
- Verify model is available on OpenRouter
- Check OpenRouter dashboard for supported models

### "Insufficient credits" Error
- Add credits to your OpenRouter account
- Switch to free models
- Check your usage limits

### Poor Quality Results
- Try a more powerful model
- Increase `max_tokens` in orchestrator.py
- Adjust `temperature` parameter

### High Costs
- Switch to free models
- Use `gemini-flash-1.5-8b` instead of regular flash
- Monitor usage in OpenRouter dashboard

## Monitoring Usage

Check your OpenRouter dashboard:
- https://openrouter.ai/activity

Track:
- Cost per job
- Model performance
- Token usage
- Error rates

## Advanced Configuration

You can also modify the model parameters directly in `apps/processor/agent/pipeline/orchestrator.py`:

```python
response = client.chat.completions.create(
    model=analyst_model,
    messages=messages,
    max_tokens=800,        # Increase for longer responses
    temperature=0.3,       # Lower = more consistent, Higher = more creative
)
```

## Recommended Setup by Use Case

### Personal Projects (Free Tier)
```env
ANALYST_MODEL=google/gemini-flash-1.5-8b
DIRECTOR_MODEL=meta-llama/llama-3.1-8b-instruct:free
```

### Small Business (Low Budget)
```env
ANALYST_MODEL=google/gemini-flash-1.5
DIRECTOR_MODEL=meta-llama/llama-3.1-70b-instruct:free
```

### Professional (Quality Matters)
```env
ANALYST_MODEL=openai/gpt-4o
DIRECTOR_MODEL=anthropic/claude-3-5-sonnet
```

### Auto-Routing (Let OpenRouter Decide)
```env
ANALYST_MODEL=openrouter/auto
DIRECTOR_MODEL=openrouter/auto
```

---

**Current Configuration**: Check your `apps/processor/.env` file to see which models are active.

**After changing models**: Restart the Python agent for changes to take effect.
